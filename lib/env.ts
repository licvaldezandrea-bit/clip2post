import { z } from "zod";

// Validación fail-closed: si falta una variable requerida, la app NO arranca
// con un valor de juguete — crashea de inmediato con un mensaje claro
// (ver 09-SEGURIDAD.md / 51-STACK-PINEADO.md).
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SECRET_KEY: z.string().min(1),

  ANTHROPIC_API_KEY: z.string().min(1),
  ASSEMBLYAI_API_KEY: z.string().min(1),
  AI_MODEL: z.string().min(1).default("claude-sonnet-4-6"),
  AI_MODEL_FALLBACK: z.string().min(1).optional(),
  AI_DAILY_BUDGET_USD: z.coerce.number().positive().default(20),
  AI_MONTHLY_BUDGET_USD: z.coerce.number().positive().default(250),
});

// Cada handler que la necesite llama a getEnv() — no se valida en el import
// de módulo (rompería `next build`, que no tiene las env vars de runtime).
let cached: z.infer<typeof envSchema> | null = null;
export function getEnv() {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      "Faltan variables de entorno requeridas: " +
        JSON.stringify(parsed.error.flatten().fieldErrors),
    );
  }
  cached = parsed.data;
  return cached;
}
