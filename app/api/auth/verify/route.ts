import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  codigo: z.string().trim().regex(/^\d{6,8}$/),
});

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "El código tiene que ser de 6 dígitos.", codigo: "formato" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.codigo,
    type: "email",
  });
  if (error) {
    return NextResponse.json(
      { error: "Ese código no es correcto o ya venció. Pide uno nuevo.", codigo: "codigo" },
      { status: 401 },
    );
  }
  return NextResponse.json({ ok: true });
}
