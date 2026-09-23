import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { transcribeAudio } from "@/lib/transcribe";
import { generatePiezas } from "@/lib/ai-adapter";
import { dentroDelPresupuesto, registrarGasto } from "@/lib/budget";

// BFF: el único lugar donde viven las claves de IA/transcripción. El navegador nunca
// las ve — solo llama a esta ruta con su sesión de Supabase.
//
// NOTA DE ARQUITECTURA (documentada, no oculta): el patrón canónico de 30-INTEGRACION-IA.md
// es job asíncrono (crear media_jobs 'pending' → responder ya → worker en background →
// Realtime/polling). Acá, para tener un pipeline REAL funcionando primero, el job se
// procesa DENTRO de esta misma request (síncrono) — la fila de media_jobs ya queda
// modelada para moverlo a un worker de verdad sin tocar el esquema. Ver ESTADO.md.

const BodySchema = z.object({
  titulo: z.string().min(1).max(200),
  audioUrl: z.string().url(),
  idempotencyKey: z.string().min(1),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", detalle: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { titulo, audioUrl, idempotencyKey } = parsed.data;

  const presupuesto = await dentroDelPresupuesto();
  if (!presupuesto.ok) {
    return NextResponse.json(
      { error: "La generación está pausada por un momento, ya la estamos revisando. Volvé a intentar más tarde." },
      { status: 503 },
    );
  }

  const admin = createAdminClient();

  // Idempotencia: si ya existe un job con esta key, no se genera (ni cobra) dos veces.
  const { data: existente } = await admin
    .from("media_jobs")
    .select("id, status, result_url")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();
  if (existente) {
    return NextResponse.json({ jobId: existente.id, status: existente.status });
  }

  const { data: video, error: videoError } = await admin
    .from("videos")
    .insert({ user_id: user.id, titulo, fuente_url: audioUrl, status: "procesando" })
    .select()
    .single();
  if (videoError || !video) {
    return NextResponse.json({ error: "No se pudo crear el video" }, { status: 500 });
  }

  const { data: job } = await admin
    .from("media_jobs")
    .insert({
      user_id: user.id,
      video_id: video.id,
      kind: "text",
      status: "processing",
      input: { audioUrl, titulo },
      idempotency_key: idempotencyKey,
    })
    .select()
    .single();

  try {
    const transcripcion = await transcribeAudio(audioUrl);

    const { data: profile } = await admin
      .from("profiles")
      .select("tono")
      .eq("id", user.id)
      .single();
    const tono = (profile?.tono ?? "directo") as "directo" | "educativo" | "provocador";

    const { piezas, tokensIn, tokensOut, modelo } = await generatePiezas(transcripcion, tono);

    await admin.from("piezas").insert([
      { user_id: user.id, video_id: video.id, red: "linkedin", contenido: piezas.linkedin },
      { user_id: user.id, video_id: video.id, red: "x", contenido: piezas.x },
      { user_id: user.id, video_id: video.id, red: "instagram", contenido: piezas.instagram },
    ]);

    await registrarGasto({ userId: user.id, jobId: job?.id, modelo, tokensIn, tokensOut });

    await admin.from("videos").update({ transcripcion, status: "listo" }).eq("id", video.id);
    await admin.from("media_jobs").update({ status: "done" }).eq("id", job?.id);

    return NextResponse.json({ jobId: job?.id, videoId: video.id, status: "done", piezas });
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : "Error desconocido";
    await admin.from("videos").update({ status: "error" }).eq("id", video.id);
    await admin.from("media_jobs").update({ status: "failed", error: mensaje }).eq("id", job?.id);
    return NextResponse.json(
      { error: "No pudimos convertir tu video. Probá de nuevo en un momento." },
      { status: 502 },
    );
  }
}
