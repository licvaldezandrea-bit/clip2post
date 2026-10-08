import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 1) Refresca la sesión de Supabase en cada request (sin esto el token expira a mitad de sesión).
// 2) Protege la app: sin sesión no se entra a /app; con sesión, /login te manda a la app.
// La seguridad real de los datos NO depende de esto: cada API valida la sesión y RLS protege la base.
const RUTAS_PRIVADAS = ["/app", "/app.html"];
const RUTAS_DE_ENTRADA = ["/login", "/login.html"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const ruta = request.nextUrl.pathname;

  if (!user && RUTAS_PRIVADAS.includes(ruta)) {
    return NextResponse.redirect(new URL("/login.html", request.url));
  }
  if (user && RUTAS_DE_ENTRADA.includes(ruta)) {
    return NextResponse.redirect(new URL("/app.html", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|webp|json|ico)$).*)"],
};
