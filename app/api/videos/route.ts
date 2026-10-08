import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Lectura de los datos del usuario: usa el cliente con SU sesión, así que la seguridad
// la impone RLS (solo ve lo suyo) — no hay ningún id de usuario que venga del navegador.
const HORAS_POR_VIDEO = 1.5; // estimación honesta de reescribir a mano las 3 piezas

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const [{ data: perfil }, { data: videos, error }] = await Promise.all([
    supabase.from("profiles").select("plan, trial_ends_at, plan_hasta, tono").eq("id", user.id).single(),
    supabase
      .from("videos")
      .select("id, titulo, status, created_at, piezas(red, contenido)")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(50),
  ]);
  if (error) {
    console.error("[videos]", error.message);
    return NextResponse.json({ error: "No pudimos cargar tus videos." }, { status: 500 });
  }

  const lista = videos ?? [];
  const listos = lista.filter((v) => v.status === "listo");
  const haceUnaSemana = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const estaSemana = listos.filter((v) => new Date(v.created_at).getTime() >= haceUnaSemana);
  const trialHasta = perfil?.trial_ends_at ? new Date(perfil.trial_ends_at) : null;
  const diasRestantes =
    perfil?.plan === "trial" && trialHasta
      ? Math.max(0, Math.ceil((trialHasta.getTime() - Date.now()) / 86_400_000))
      : null;

  return NextResponse.json({
    usuario: { email: user.email },
    plan: {
      plan: perfil?.plan ?? "trial",
      diasRestantes,
      planHasta: perfil?.plan_hasta ?? null,
      tono: perfil?.tono ?? "directo",
    },
    stats: {
      videosSemana: estaSemana.length,
      piezasSemana: estaSemana.length * 3,
      horasSemana: Math.round(estaSemana.length * HORAS_POR_VIDEO * 10) / 10,
      videosTotal: listos.length,
    },
    videos: lista,
  });
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Id inválido" }, { status: 400 });

  const { error } = await supabase.from("videos").delete().eq("id", id); // RLS: solo borra lo suyo
  if (error) return NextResponse.json({ error: "No pudimos borrarlo." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
