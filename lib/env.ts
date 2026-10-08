import { z } from "zod";

// Validación fail-closed: si falta una variable requerida, la app NO arranca
// con un valor de juguete — crashea de inmediato con un mensaje claro
// (ver 09-SEGURIDAD.md / 51-STACK-PINEADO.md).
// Una variable vacía (VAR=) cuenta como "no configurada": así las opcionales no tumban la app
// y los números caen a su valor por defecto.
const vacioEsNada = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);
const opcional = <T extends z.ZodTypeAny>(esquema: T) => z.preprocess(vacioEsNada, esquema.optional());
const conDefecto = <T extends z.ZodTypeAny>(esquema: T, valor: unknown) =>
  z.preprocess(vacioEsNada, esquema.default(valor as never));

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SECRET_KEY: z.string().min(1),

  ANTHROPIC_API_KEY: z.string().min(1),
  ASSEMBLYAI_API_KEY: z.string().min(1),
  AI_MODEL: conDefecto(z.string().min(1), "claude-sonnet-4-6"),
  AI_MODEL_FALLBACK: opcional(z.string().min(1)),
  AI_DAILY_BUDGET_USD: conDefecto(z.coerce.number().positive(), 20),
  AI_MONTHLY_BUDGET_USD: conDefecto(z.coerce.number().positive(), 250),

  // Cupos de uso justo (el "ilimitado" de la oferta se sostiene con un tope razonable)
  MAX_VIDEOS_TRIAL: conDefecto(z.coerce.number().int().positive(), 3),
  MAX_VIDEOS_MES: conDefecto(z.coerce.number().int().positive(), 60),
  AI_RESERVA_USD: conDefecto(z.coerce.number().positive(), 0.5),
  // Tope de costo REAL de IA por usuario y por mes (~20% del precio de cada plan: anual US$7.42, mensual US$12.99)
  MAX_COSTO_TRIAL_USD: conDefecto(z.coerce.number().positive(), 0.5),
  MAX_COSTO_MENSUAL_USD: conDefecto(z.coerce.number().positive(), 2.4),
  MAX_COSTO_ANUAL_USD: conDefecto(z.coerce.number().positive(), 1.4),
  ASSEMBLYAI_USD_PER_HOUR: conDefecto(z.coerce.number().positive(), 0.37),

  // Venta (Hotmart). Opcional hasta que exista el producto; el webhook rechaza todo si falta.
  HOTMART_HOTTOK: opcional(z.string().min(1)),
  HOTMART_ANNUAL_OFFER_CODES: opcional(z.string()), // códigos de oferta anual, separados por coma
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
