import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { track } from "@/lib/events";

// Derecho a eliminación (LGPD y leyes afines): borra la cuenta y, por cascada en la base,
// perfil, videos, transcripciones, piezas y trabajos. Los registros de gasto y eventos
// quedan sin vínculo con la persona (user_id pasa a null).
export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const admin = createAdminClient();

  // Archivos que pudieran haber quedado subidos y sin procesar.
  const { data: archivos } = await admin.storage.from("videos").list(user.id, { limit: 1000 });
  if (archivos && archivos.length > 0) {
    await admin.storage.from("videos").remove(archivos.map((a) => `${user.id}/${a.name}`));
  }

  await track(null, "cuenta_eliminada", {});
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[cuenta] no se pudo eliminar", error.message);
    return NextResponse.json({ error: "No pudimos eliminar tu cuenta. Intenta de nuevo." }, { status: 500 });
  }
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
