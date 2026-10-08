import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Destino del link del correo: canjea el código por una sesión (cookies httpOnly) y entra a la app.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/app.html", url.origin));
  }
  return NextResponse.redirect(new URL("/login.html?error=link", url.origin));
}
