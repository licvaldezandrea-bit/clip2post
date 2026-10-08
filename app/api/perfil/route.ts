import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// El usuario solo puede cambiar su tono. Se hace con SU sesión (RLS + permiso de columna
// en la base: ni plan ni fechas se pueden tocar desde acá aunque se intentara).
const BodySchema = z.object({ tono: z.enum(["directo", "educativo", "provocador"]) });

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Tono inválido" }, { status: 400 });

  const { error } = await supabase.from("profiles").update({ tono: parsed.data.tono }).eq("id", user.id);
  if (error) {
    console.error("[perfil]", error.message);
    return NextResponse.json({ error: "No pudimos guardar el tono." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
