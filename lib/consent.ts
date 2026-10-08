import { createAdminClient } from "@/lib/supabase/admin";
import { VERSION_LEGAL } from "@/lib/legal";
import { track } from "@/lib/events";

// Primera vez que una persona entra: guarda que aceptó Términos y Privacidad (versión + fecha),
// vinculado a su identidad ya verificada (no a una bandera del navegador).
export async function registrarConsentimiento(userId: string) {
  const admin = createAdminClient();
  const { data: perfil } = await admin.from("profiles").select("consentimiento_at").eq("id", userId).single();
  if (perfil && !perfil.consentimiento_at) {
    await admin
      .from("profiles")
      .update({ consentimiento_version: VERSION_LEGAL, consentimiento_at: new Date().toISOString() })
      .eq("id", userId);
    await track(userId, "consentimiento", { version: VERSION_LEGAL, terminos: true, privacidad: true });
  }
}
