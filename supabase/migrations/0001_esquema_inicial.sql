-- Esquema inicial de Clip2Post: perfiles, videos, piezas generadas, cola de trabajos de IA y gasto.
-- Patrón RLS: (select auth.uid()) envuelto en subquery (alto rendimiento, ver 25-BASE-DE-DATOS.md)
-- y columna de la política siempre indexada.

-- ── trigger genérico de updated_at ──────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles: 1 fila por usuario, se crea sola al registrarse ──────────────
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  plan          text not null default 'trial' check (plan in ('trial','anual','mensual','cancelado')),
  trial_ends_at timestamptz not null default (now() + interval '7 days'),
  tono          text not null default 'directo' check (tono in ('directo','educativo','provocador')),
  racha_semanas int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
create policy "select_own" on public.profiles for select using ((select auth.uid()) = id);
create policy "update_own" on public.profiles for update
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
-- Sin policy de insert/delete: la fila la crea el trigger de abajo (security definer), nunca el cliente.

-- Crea el profile automáticamente cuando Supabase Auth crea el usuario.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── videos: cada video que el usuario convierte ─────────────────────────────
create table public.videos (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  titulo       text not null check (length(titulo) between 1 and 200),
  fuente_url   text,                  -- link pegado por el usuario (YouTube, Drive, etc.)
  fuente_path  text,                  -- o archivo subido a Supabase Storage
  transcripcion text,                 -- se completa cuando el job de transcripción termina
  status       text not null default 'procesando' check (status in ('procesando','listo','error')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index videos_user_created_idx on public.videos (user_id, created_at desc, id desc); -- keyset pagination
create trigger videos_set_updated_at before update on public.videos
  for each row execute function public.set_updated_at();

alter table public.videos enable row level security;
create policy "select_own" on public.videos for select using ((select auth.uid()) = user_id);
create policy "insert_own" on public.videos for insert with check ((select auth.uid()) = user_id);
create policy "update_own" on public.videos for update
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete_own" on public.videos for delete using ((select auth.uid()) = user_id);

-- ── piezas: el post/hilo/carrusel generado por video y por red ─────────────
create table public.piezas (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  video_id   uuid not null references public.videos(id) on delete cascade,
  red        text not null check (red in ('linkedin','x','instagram')),
  contenido  jsonb not null,          -- estructura por red: post/tweets[]/slides[] (ver lib/ai-adapter)
  created_at timestamptz not null default now()
);
create index piezas_user_created_idx on public.piezas (user_id, created_at desc, id desc);
create index piezas_video_idx on public.piezas (video_id);
create unique index piezas_video_red_uidx on public.piezas (video_id, red); -- 1 pieza por red y por video

alter table public.piezas enable row level security;
create policy "select_own" on public.piezas for select using ((select auth.uid()) = user_id);
create policy "insert_own" on public.piezas for insert with check ((select auth.uid()) = user_id);
create policy "delete_own" on public.piezas for delete using ((select auth.uid()) = user_id);
-- Sin policy de update: una pieza generada no se edita in-place, se regenera (nueva fila).

-- ── media_jobs: patrón de job asíncrono (transcribir + generar 3 piezas) ───
-- Fuente canónica del patrón: docs/sistema/30-INTEGRACION-IA.md
create table public.media_jobs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  video_id        uuid references public.videos(id) on delete cascade,
  kind            text not null check (kind in ('image','audio','text','video')),
  priority        int not null default 0,
  status          text not null default 'pending' check (status in ('pending','processing','done','failed')),
  input           jsonb not null,
  result_url      text,
  error           text,
  idempotency_key text unique,
  created_at      timestamptz not null default now()
);
create index media_jobs_user_idx on public.media_jobs(user_id);
create index media_jobs_pending_idx on public.media_jobs (priority desc, created_at)
  where status = 'pending'; -- el worker escanea solo lo pendiente, no la tabla completa

alter table public.media_jobs enable row level security;
create policy "own_jobs" on public.media_jobs
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── ai_calls: gasto real por llamada — de acá lee el kill-switch de 30 ─────
create table public.ai_calls (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  job_id        uuid references public.media_jobs(id) on delete set null,
  modelo        text not null,
  tokens_in     int not null default 0,
  tokens_out    int not null default 0,
  costo_usd     numeric(10,4) not null default 0,
  created_at    timestamptz not null default now()
);
create index ai_calls_created_idx on public.ai_calls (created_at desc); -- suma diaria/mensual del kill-switch
create index ai_calls_user_idx on public.ai_calls (user_id);

alter table public.ai_calls enable row level security;
-- Tabla de costos: solo la escribe el servidor (secret key, que salta RLS). Ningún cliente autenticado
-- debe poder leer el gasto de otros usuarios ni el propio en detalle desde el navegador.
-- Sin policies para 'authenticated' => bloqueada por defecto para el cliente; el backoffice (21) la
-- consulta con la secret key del servidor.
