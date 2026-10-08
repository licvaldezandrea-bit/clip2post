import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { registrarConsentimiento } from "@/lib/consent";

// Destino del link del correo: canjea el código por una sesión (cookies httpOnly) y entra a la app.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (data.user?.id) await registrarConsentimiento(data.user.id);
      return NextResponse.redirect(new URL("/app.html", url.origin));
    }
  }
  return NextResponse.redirect(new URL("/login.html?error=link", url.origin));
}
