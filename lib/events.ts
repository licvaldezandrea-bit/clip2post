import { createAdminClient } from "@/lib/supabase/admin";

// Evento canónico del producto (de acá sale el backoffice y la medición del embudo).
// Nunca debe romper la acción principal: si falla el registro, solo se loguea.
export async function track(userId: string | null, evento: string, props: Record<string, unknown> = {}) {
  const { error } = await createAdminClient()
    .from("event_log")
    .insert({ user_id: userId, evento, props });
  if (error) console.error("[events] no se pudo registrar", evento, error.message);
}
