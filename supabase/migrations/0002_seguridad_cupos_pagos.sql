-- 0002: cierra los huecos de la auditoría + cupos atómicos + pagos + eventos + storage.
-- Principio: el navegador (rol authenticated) SOLO lee lo suyo y cambia su "tono".
-- Todo lo demás (plan, trial, videos, piezas, jobs, gasto) lo escribe únicamente el servidor.

-- ── 1. Nadie desde el navegador escribe más de lo necesario ────────────────
revoke all on all tables in schema public from anon;
revoke insert, update, delete on public.videos, public.piezas, public.media_jobs, public.profiles, public.ai_calls from authenticated;
revoke select on public.ai_calls from authenticated;

-- profiles: el usuario solo puede cambiar su tono (NO plan, NO trial_ends_at)
grant update (tono) on public.profiles to authenticated;

-- videos / piezas: el usuario puede borrar lo suyo (derecho al olvido); crear/editar lo hace el servidor
grant delete on public.videos, public.piezas to authenticated;
drop policy if exists "insert_own" on public.videos;
drop policy if exists "update_own" on public.videos;
drop policy if exists "insert_own" on public.piezas;

-- media_jobs: solo lectura
drop policy if exists "own_jobs" on public.media_jobs;
create policy "select_own" on public.media_jobs for select using ((select auth.uid()) = user_id);

-- idempotencia por usuario (antes era global: una llave ajena podía chocar o filtrar)
alter table public.media_jobs drop constraint if exists media_jobs_idempotency_key_key;
create unique index if not exists media_jobs_user_idem_uidx on public.media_jobs (user_id, idempotency_key);

-- ── 2. Pagos (Hotmart) y eventos ───────────────────────────────────────────
alter table public.profiles add column if not exists hotmart_subscription text;
alter table public.profiles add column if not exists plan_hasta timestamptz;

create table if not exists public.hotmart_events (
  id         text primary key,                 -- id del evento de Hotmart: garantiza idempotencia
  evento     text not null,
  payload    jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.hotmart_events enable row level security;
revoke all on public.hotmart_events from anon, authenticated;

create table if not exists public.event_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  evento     text not null,
  props      jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists event_log_evento_idx on public.event_log (evento, created_at desc);
create index if not exists event_log_user_idx on public.event_log (user_id);
alter table public.event_log enable row level security;
revoke all on public.event_log from anon, authenticated;

-- ── 3. Reserva atómica: plan + cupo + presupuesto + idempotencia, todo en un paso ──
-- La llama SOLO el servidor (service_role). Un lock serializa el presupuesto global:
-- dos requests simultáneos no pueden pasarse del tope.
create or replace function public.reserve_generation(
  p_user_id uuid, p_titulo text, p_fuente_url text, p_fuente_path text, p_idempotency_key text,
  p_reserva_usd numeric, p_limite_dia numeric, p_limite_mes numeric, p_max_trial int, p_max_mes int
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_profile public.profiles;
  v_existente public.media_jobs;
  v_count int;
  v_dia numeric;
  v_mes numeric;
  v_video public.videos;
  v_job public.media_jobs;
  v_reserva uuid;
begin
  perform pg_advisory_xact_lock(hashtext('clip2post-generate'));

  select * into v_existente from public.media_jobs
    where user_id = p_user_id and idempotency_key = p_idempotency_key;
  if found then
    return jsonb_build_object('estado','duplicado','job_id',v_existente.id,'video_id',v_existente.video_id,'job_status',v_existente.status);
  end if;

  select * into v_profile from public.profiles where id = p_user_id;
  if not found then return jsonb_build_object('estado','sin_perfil'); end if;

  if v_profile.plan = 'cancelado'
     or (v_profile.plan = 'trial' and v_profile.trial_ends_at < now())
     or (v_profile.plan in ('anual','mensual') and v_profile.plan_hasta is not null and v_profile.plan_hasta < now()) then
    return jsonb_build_object('estado','sin_acceso','plan',v_profile.plan);
  end if;

  if v_profile.plan = 'trial' then
    select count(*) into v_count from public.videos where user_id = p_user_id and status <> 'error';
    if v_count >= p_max_trial then return jsonb_build_object('estado','cupo_agotado','limite',p_max_trial,'plan','trial'); end if;
  else
    select count(*) into v_count from public.videos
      where user_id = p_user_id and status <> 'error' and created_at >= date_trunc('month', now());
    if v_count >= p_max_mes then return jsonb_build_object('estado','cupo_agotado','limite',p_max_mes,'plan',v_profile.plan); end if;
  end if;

  if exists (select 1 from public.media_jobs
             where user_id = p_user_id and status in ('pending','processing') and created_at > now() - interval '15 minutes') then
    return jsonb_build_object('estado','en_curso');
  end if;

  select coalesce(sum(costo_usd),0) into v_dia from public.ai_calls where created_at >= date_trunc('day', now());
  if v_dia + p_reserva_usd > p_limite_dia then return jsonb_build_object('estado','presupuesto','ventana','dia'); end if;
  select coalesce(sum(costo_usd),0) into v_mes from public.ai_calls where created_at >= date_trunc('month', now());
  if v_mes + p_reserva_usd > p_limite_mes then return jsonb_build_object('estado','presupuesto','ventana','mes'); end if;

  insert into public.videos (user_id, titulo, fuente_url, fuente_path, status)
    values (p_user_id, p_titulo, p_fuente_url, p_fuente_path, 'procesando') returning * into v_video;
  insert into public.media_jobs (user_id, video_id, kind, status, input, idempotency_key)
    values (p_user_id, v_video.id, 'text', 'processing', jsonb_build_object('titulo', p_titulo), p_idempotency_key)
    returning * into v_job;
  insert into public.ai_calls (user_id, job_id, modelo, costo_usd)
    values (p_user_id, v_job.id, 'reserva', p_reserva_usd) returning id into v_reserva;

  return jsonb_build_object('estado','ok','video_id',v_video.id,'job_id',v_job.id,'reserva_id',v_reserva);
end;
$$;
revoke all on function public.reserve_generation(uuid,text,text,text,text,numeric,numeric,numeric,int,int) from public, anon, authenticated;
grant execute on function public.reserve_generation(uuid,text,text,text,text,numeric,numeric,numeric,int,int) to service_role;

-- ── 4. Storage privado para los videos que sube el usuario ─────────────────
-- Sin policies sobre storage.objects: el navegador NO accede directo; solo URLs firmadas
-- que emite el servidor. El archivo se borra apenas se transcribe.
insert into storage.buckets (id, name, public, file_size_limit)
values ('videos', 'videos', false, 52428800)
on conflict (id) do update set public = false, file_size_limit = 52428800;

-- ── 5. email en profiles (para vincular compras de Hotmart con usuarios) ───
alter table public.profiles add column if not exists email text;
update public.profiles p set email = lower(u.email) from auth.users u where u.id = p.id and p.email is null;
create unique index if not exists profiles_email_uidx on public.profiles (lower(email));

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, lower(new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ── 6. Consentimiento atribuible (términos + privacidad), registrado con versión y fecha ──
alter table public.profiles add column if not exists consentimiento_version text;
alter table public.profiles add column if not exists consentimiento_at timestamptz;
