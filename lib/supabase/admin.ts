import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";

// Cliente ADMIN — usa la secret key, SALTA RLS por completo.
// SOLO se importa desde código que corre en el servidor (route handlers, webhooks,
// workers). JAMÁS importar esto desde un componente cliente ni exponer su resultado
// al navegador. Úsalo para: webhooks de Hotmart, el worker de media_jobs, y el
// kill-switch de gasto de IA (lee/escribe ai_calls, que el cliente no puede tocar).
export function createAdminClient() {
  const env = getEnv();
  return createSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
