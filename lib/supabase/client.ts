import { createBrowserClient } from "@supabase/ssr";

// Cliente del NAVEGADOR — usa la publishable key (pública por diseño, protegida por RLS).
// Nunca importar este archivo desde código que corre solo en el servidor con la secret key.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
