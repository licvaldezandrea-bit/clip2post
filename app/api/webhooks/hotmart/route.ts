import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEnv } from "@/lib/env";
import { hottokValido, parsearEventoHotmart } from "@/lib/hotmart";
import { track } from "@/lib/events";

// Webhook de Hotmart: único lugar donde el plan de un usuario pasa a "pago".
// Seguridad: hottok comparado en tiempo constante, idempotencia por id de evento, y nunca se
// confía en nada que no venga firmado. Si falta HOTMART_HOTTOK, rechaza TODO (fail-closed).
export async function POST(req: Request) {
  const env = getEnv();
  const recibido = req.headers.get("x-hotmart-hottok");

  const crudo = await req.text();
  let payload: unknown;
  try {
    payload = JSON.parse(crudo);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const hottok = recibido ?? (payload as { hottok?: string })?.hottok ?? null;

  if (!env.HOTMART_HOTTOK) {
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 });
  }
  if (!hottokValido(hottok, env.HOTMART_HOTTOK)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const codigosAnuales = (env.HOTMART_ANNUAL_OFFER_CODES ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const { eventId, evento, resultado } = parsearEventoHotmart(payload, codigosAnuales);

  const admin = createAdminClient();

  // Idempotencia: si ya procesamos este evento, respondemos 200 sin repetir nada.
  const { error: dupError } = await admin.from("hotmart_events").insert({ id: eventId, evento, payload });
  if (dupError) {
    if (dupError.code === "23505") return NextResponse.json({ ok: true, duplicado: true });
    console.error("[hotmart] no se pudo registrar el evento", dupError.message);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }

  if (resultado.accion === "ignorar") {
    return NextResponse.json({ ok: true, ignorado: resultado.motivo });
  }

  // Busca (o crea) al usuario por email.
  let { data: perfil } = await admin.from("profiles").select("id").ilike("email", resultado.email).maybeSingle();
  if (!perfil && resultado.accion === "activar") {
    const { data: nuevo, error: crearError } = await admin.auth.admin.createUser({
      email: resultado.email,
      email_confirm: true,
    });
    if (crearError || !nuevo.user) {
      console.error("[hotmart] no se pudo crear el usuario", crearError?.message);
      await admin.from("hotmart_events").delete().eq("id", eventId); // que Hotmart reintente
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
    perfil = { id: nuevo.user.id };
  }
  if (!perfil) return NextResponse.json({ ok: true, ignorado: "usuario_inexistente" });

  if (resultado.accion === "activar") {
    const { error } = await admin
      .from("profiles")
      .update({ plan: resultado.plan, plan_hasta: resultado.hasta.toISOString(), hotmart_subscription: resultado.suscripcion })
      .eq("id", perfil.id);
    if (error) {
      await admin.from("hotmart_events").delete().eq("id", eventId);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
    await track(perfil.id, "pago_aprobado", { plan: resultado.plan, evento });
  } else {
    const { error } = await admin.from("profiles").update({ plan: "cancelado" }).eq("id", perfil.id);
    if (error) {
      await admin.from("hotmart_events").delete().eq("id", eventId);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
    await track(perfil.id, "plan_cancelado", { evento });
  }
  return NextResponse.json({ ok: true });
}
