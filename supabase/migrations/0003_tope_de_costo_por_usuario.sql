-- 0003: tope de costo REAL de IA por usuario y por mes (regla de rentabilidad: la IA no puede
-- costar más del ~20% de lo que paga cada plan). Se suma al tope de cantidad de videos.
-- Reemplaza la función reserve_generation agregando 3 parámetros (costo máximo por plan).

drop function if exists public.reserve_generation(uuid,text,text,text,text,numeric,numeric,numeric,int,int);

create or replace function public.reserve_generation(
  p_user_id uuid, p_titulo text, p_fuente_url text, p_fuente_path text, p_idempotency_key text,
  p_reserva_usd numeric, p_limite_dia numeric, p_limite_mes numeric, p_max_trial int, p_max_mes int,
  p_costo_trial numeric, p_costo_mensual numeric, p_costo_anual numeric
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_profile public.profiles;
  v_existente public.media_jobs;
  v_count int;
  v_dia numeric;
  v_mes numeric;
  v_costo_usuario numeric;
  v_tope_costo numeric;
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
    v_tope_costo := p_costo_trial;
    select coalesce(sum(costo_usd),0) into v_costo_usuario from public.ai_calls
      where user_id = p_user_id and modelo <> 'reserva';
  else
    select count(*) into v_count from public.videos
      where user_id = p_user_id and status <> 'error' and created_at >= date_trunc('month', now());
    if v_count >= p_max_mes then return jsonb_build_object('estado','cupo_agotado','limite',p_max_mes,'plan',v_profile.plan); end if;
    v_tope_costo := case when v_profile.plan = 'anual' then p_costo_anual else p_costo_mensual end;
    select coalesce(sum(costo_usd),0) into v_costo_usuario from public.ai_calls
      where user_id = p_user_id and modelo <> 'reserva' and created_at >= date_trunc('month', now());
  end if;

  -- Tope de costo real de IA de este usuario (protege el margen del plan)
  if v_costo_usuario >= v_tope_costo then
    return jsonb_build_object('estado','cupo_agotado','motivo','uso_incluido','plan',v_profile.plan);
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

revoke all on function public.reserve_generation(uuid,text,text,text,text,numeric,numeric,numeric,int,int,numeric,numeric,numeric) from public, anon, authenticated;
grant execute on function public.reserve_generation(uuid,text,text,text,text,numeric,numeric,numeric,int,int,numeric,numeric,numeric) to service_role;
