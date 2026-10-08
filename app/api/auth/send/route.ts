import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Envía el acceso por correo (link + código de 6 dígitos). Todo del lado del servidor:
// el navegador nunca habla con Supabase Auth directamente, así las cookies de sesión son
// httpOnly y no hace falta cargar librerías de terceros en la página de entrar.
const BodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  acepta: z.literal(true), // casilla de términos + privacidad, nunca premarcada
});

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Escribe un correo válido y acepta los términos para continuar.", codigo: "email" }, { status: 400 });
  }

  const origen = new URL(req.url).origin;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: `${origen}/auth/callback`, shouldCreateUser: true },
  });

  if (error) {
    console.error("[auth/send]", error.status, error.message);
    if (error.status === 429) {
      return NextResponse.json(
        { error: "Pediste muchos accesos seguidos. Espera un minuto y vuelve a intentar.", codigo: "limite" },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: "No pudimos enviar el correo. Intenta de nuevo.", codigo: "envio" }, { status: 502 });
  }
  // Respuesta idéntica exista o no la cuenta (anti-enumeración).
  return NextResponse.json({ ok: true });
}
