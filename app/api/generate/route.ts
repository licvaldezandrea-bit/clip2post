import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { costoTranscripcionUsd, transcribeAudio } from "@/lib/transcribe";
import { generatePiezas } from "@/lib/ai-adapter";
import { limitesDeUso, liberarReserva, registrarGasto } from "@/lib/budget";
import { MENSAJE_URL, validarUrlMedia } from "@/lib/url-safety";
import { track } from "@/lib/events";

// BFF: el único lugar donde viven las claves de IA/transcripción. El navegador nunca
// las ve — solo llama a esta ruta con su sesión.
//
// Arquitectura (documentada en ESTADO.md): el job se procesa dentro de esta misma request
// (síncrono, tope ~5 min). La tabla media_jobs ya está modelada para pasar a un worker real
// sin tocar el esquema cuando haya volumen. Plan, cupo, presupuesto e idempotencia se
// deciden de forma atómica en la función SQL reserve_generation.
export const maxDuration = 300;

const BodySchema = z
  .object({
    titulo: z.string().trim().min(1).max(200),
    idempotencyKey: z.string().min(8).max(100),
    audioUrl: z.string().max(2000).optional(),
    storagePath: z.string().max(300).optional(),
  })
  .refine((b) => Boolean(b.audioUrl) !== Boolean(b.storagePath), {
    message: "Envía un link o un archivo subido, no ambos",
  });

const RESPUESTAS: Record<string, { status: number; error: string; codigo: string }> = {
  sin_acceso: {
    status: 402,
    codigo: "sin_acceso",
    error: "Tu prueba terminó o tu plan no está activo. Elige un plan para seguir convirtiendo videos.",
  },
  cupo_agotado: {
    status: 402,
    codigo: "cupo_agotado",
    error: "Llegaste al límite de videos de tu plan por ahora.",
  },
  en_curso: {
    status: 409,
    codigo: "en_curso",
    error: "Ya tienes un video procesándose. Espera a que termine para subir otro.",
  },
  presupuesto: {
    status: 503,
    codigo: "pausado",
    error: "La generación está pausada por un momento. Ya lo estamos revisando, vuelve a intentar más tarde.",
  },
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", codigo: "invalido" }, { status: 400 });
  }
  const { titulo, idempotencyKey, audioUrl, storagePath } = parsed.data;

  if (audioUrl) {
    const v = validarUrlMedia(audioUrl);
    if (!v.ok) {
      return NextResponse.json({ error: MENSAJE_URL[v.motivo], codigo: "url_" + v.motivo }, { status: 400 });
    }
  }
  if (storagePath && (!storagePath.startsWith(`${user.id}/`) || storagePath.includes(".."))) {
    return NextResponse.json({ error: "Archivo inválido", codigo: "invalido" }, { status: 400 });
  }

  const admin = createAdminClient();
  const lim = limitesDeUso();

  const { data: reserva, error: reservaError } = await admin.rpc("reserve_generation", {
    p_user_id: user.id,
    p_titulo: titulo,
    p_fuente_url: audioUrl ?? null,
    p_fuente_path: storagePath ?? null,
    p_idempotency_key: idempotencyKey,
    p_reserva_usd: lim.reservaUsd,
    p_limite_dia: lim.limiteDia,
    p_limite_mes: lim.limiteMes,
    p_max_trial: lim.maxTrial,
    p_max_mes: lim.maxMes,
  });
  if (reservaError || !reserva) {
    console.error("[generate] reserve_generation falló", reservaError?.message);
    return NextResponse.json({ error: "No pudimos iniciar la conversión. Intenta de nuevo.", codigo: "interno" }, { status: 500 });
  }

  if (reserva.estado === "duplicado") {
    return NextResponse.json({ jobId: reserva.job_id, videoId: reserva.video_id, status: reserva.job_status, duplicado: true });
  }
  if (reserva.estado !== "ok") {
    const r = RESPUESTAS[reserva.estado];
    if (r) {
      await track(user.id, "generacion_bloqueada", { motivo: reserva.estado, plan: reserva.plan });
      return NextResponse.json({ error: r.error, codigo: r.codigo, limite: reserva.limite }, { status: r.status });
    }
    return NextResponse.json({ error: "No pudimos iniciar la conversión.", codigo: "interno" }, { status: 500 });
  }

  const { video_id: videoId, job_id: jobId, reserva_id: reservaId } = reserva as {
    video_id: string;
    job_id: string;
    reserva_id: string;
  };

  let costoTranscripcion = 0;
  try {
    let urlParaTranscribir = audioUrl!;
    if (storagePath) {
      const { data: firmada, error: firmaError } = await admin.storage
        .from("videos")
        .createSignedUrl(storagePath, 60 * 60);
      if (firmaError || !firmada) throw new Error("ARCHIVO_NO_ENCONTRADO");
      urlParaTranscribir = firmada.signedUrl;
    }

    const { texto, duracionSeg } = await transcribeAudio(urlParaTranscribir, AbortSignal.timeout(250_000));
    costoTranscripcion = costoTranscripcionUsd(duracionSeg);
    if (texto.trim().length < 50) throw new Error("SIN_VOZ");

    const { data: perfil } = await admin.from("profiles").select("tono").eq("id", user.id).single();
    const tono = (perfil?.tono ?? "directo") as "directo" | "educativo" | "provocador";

    const { piezas, tokensIn, tokensOut, modelo } = await generatePiezas(texto, tono);

    const { error: piezasError } = await admin.from("piezas").insert([
      { user_id: user.id, video_id: videoId, red: "linkedin", contenido: piezas.linkedin },
      { user_id: user.id, video_id: videoId, red: "x", contenido: piezas.x },
      { user_id: user.id, video_id: videoId, red: "instagram", contenido: piezas.instagram },
    ]);
    if (piezasError) throw new Error("NO_SE_GUARDARON_PIEZAS: " + piezasError.message);

    await admin.from("videos").update({ transcripcion: texto, status: "listo" }).eq("id", videoId);
    await admin.from("media_jobs").update({ status: "done" }).eq("id", jobId);

    await registrarGasto({ userId: user.id, jobId, modelo: "assemblyai", costoUsd: costoTranscripcion });
    await registrarGasto({ userId: user.id, jobId, modelo, tokensIn, tokensOut });
    await track(user.id, "generacion_completada", { video_id: videoId, duracion_seg: Math.round(duracionSeg) });

    return NextResponse.json({ jobId, videoId, status: "done", piezas });
  } catch (e) {
    const detalle = e instanceof Error ? e.message : "desconocido";
    console.error("[generate] falló", detalle);
    await admin.from("videos").update({ status: "error" }).eq("id", videoId);
    await admin.from("media_jobs").update({ status: "failed", error: detalle.slice(0, 500) }).eq("id", jobId);
    if (costoTranscripcion > 0) {
      await registrarGasto({ userId: user.id, jobId, modelo: "assemblyai", costoUsd: costoTranscripcion });
    }
    await track(user.id, "generacion_fallida", { motivo: detalle.slice(0, 80) });

    if (detalle === "SIN_VOZ") {
      return NextResponse.json({ error: "No encontramos voz en ese archivo. Prueba con otro video o audio.", codigo: "sin_voz" }, { status: 422 });
    }
    if (detalle === "TIMEOUT_TRANSCRIPCION" || (e instanceof Error && e.name === "TimeoutError")) {
      return NextResponse.json({ error: "Ese video es muy largo para procesarlo ahora. Prueba con uno de hasta unos 30 minutos.", codigo: "muy_largo" }, { status: 504 });
    }
    return NextResponse.json({ error: "No pudimos convertir tu video. Esta conversión no cuenta en tu cupo, intenta de nuevo.", codigo: "fallo" }, { status: 502 });
  } finally {
    await liberarReserva(reservaId);
    if (storagePath) await admin.storage.from("videos").remove([storagePath]);
  }
}
