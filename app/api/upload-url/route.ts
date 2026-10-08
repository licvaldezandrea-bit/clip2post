import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Emite una URL firmada para que el NAVEGADOR suba el archivo directo a Supabase Storage
// (el archivo no pasa por nuestra función: el límite de payload de Vercel es 4.5 MB).
// Bucket privado, ruta `<user_id>/<uuid>.<ext>`, tope de 50 MB (plan gratuito de Supabase).
const MAX_BYTES = 50 * 1024 * 1024;
const EXTENSIONES = ["mp3", "mp4", "m4a", "wav", "mov", "webm", "ogg", "aac", "mpeg"];

const BodySchema = z.object({
  nombre: z.string().max(200),
  tamano: z.number().int().positive(),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const ext = parsed.data.nombre.split(".").pop()?.toLowerCase() ?? "";
  if (!EXTENSIONES.includes(ext)) {
    return NextResponse.json(
      { error: "Formato no soportado. Sube un archivo mp3, mp4, m4a, wav, mov o webm.", codigo: "formato" },
      { status: 400 },
    );
  }
  if (parsed.data.tamano > MAX_BYTES) {
    return NextResponse.json(
      { error: "El archivo pesa más de 50 MB. Comprímelo o sube solo el audio.", codigo: "muy_pesado" },
      { status: 413 },
    );
  }

  const admin = createAdminClient();
  const { data: perfil } = await admin.from("profiles").select("plan, trial_ends_at, plan_hasta").eq("id", user.id).single();
  const sinAcceso =
    !perfil ||
    perfil.plan === "cancelado" ||
    (perfil.plan === "trial" && new Date(perfil.trial_ends_at) < new Date()) ||
    ((perfil.plan === "anual" || perfil.plan === "mensual") && perfil.plan_hasta && new Date(perfil.plan_hasta) < new Date());
  if (sinAcceso) {
    return NextResponse.json({ error: "Tu prueba terminó o tu plan no está activo.", codigo: "sin_acceso" }, { status: 402 });
  }

  const path = `${user.id}/${randomUUID()}.${ext}`;
  const { data, error } = await admin.storage.from("videos").createSignedUploadUrl(path);
  if (error || !data) {
    console.error("[upload-url]", error?.message);
    return NextResponse.json({ error: "No pudimos preparar la subida. Intenta de nuevo." }, { status: 500 });
  }
  return NextResponse.json({ path, token: data.token, signedUrl: data.signedUrl });
}
