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

  // Cupos de uso justo (el "ilimitado" de la oferta se sostiene con un tope razonable)
  MAX_VIDEOS_TRIAL: z.coerce.number().int().positive().default(3),
  MAX_VIDEOS_MES: z.coerce.number().int().positive().default(60),
  AI_RESERVA_USD: z.coerce.number().positive().default(0.5),
  ASSEMBLYAI_USD_PER_HOUR: z.coerce.number().positive().default(0.37),

  // Venta (Hotmart). Opcional hasta que exista el producto; el webhook rechaza todo si falta.
  HOTMART_HOTTOK: z.string().min(1).optional(),
  HOTMART_ANNUAL_OFFER_CODES: z.string().optional(), // códigos de oferta anual, separados por coma
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
        Object.keys(parsed.error.flatten().fieldErrors).join(", "),
    );
  }
  cached = parsed.data;
  return cached;
}
