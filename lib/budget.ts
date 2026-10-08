import { createAdminClient } from "@/lib/supabase/admin";
import { getEnv } from "@/lib/env";

// El tope de gasto (diario + mensual), el plan y el cupo se verifican de forma ATÓMICA dentro
// de la función SQL `reserve_generation` (migración 0002): dos requests simultáneos no pueden
// pasarse del presupuesto. Acá solo viven el cálculo de costos y el registro del gasto real.
// Fuente canónica: docs/sistema/30-INTEGRACION-IA.md

// Precios aproximados por 1M tokens (verificar vigentes antes de usarlos para facturar).
// Un modelo desconocido se calcula con el precio MÁS ALTO conocido: preferimos sobreestimar
// el gasto (frena antes) que subestimarlo.
const PRECIOS_POR_1M: Record<string, { in: number; out: number }> = {
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-haiku-4-5": { in: 1, out: 5 },
  "claude-opus-4-8": { in: 5, out: 25 },
};
const PRECIO_CONSERVADOR = { in: 5, out: 25 };

export function calcularCostoUsd(modelo: string, tokensIn: number, tokensOut: number): number {
  const precio = PRECIOS_POR_1M[modelo] ?? PRECIO_CONSERVADOR;
  return (tokensIn / 1_000_000) * precio.in + (tokensOut / 1_000_000) * precio.out;
}

export async function registrarGasto(params: {
  userId: string;
  jobId?: string;
  modelo: string;
  tokensIn?: number;
  tokensOut?: number;
  costoUsd?: number;
}) {
  const admin = createAdminClient();
  const tokensIn = params.tokensIn ?? 0;
  const tokensOut = params.tokensOut ?? 0;
  const costo_usd = params.costoUsd ?? calcularCostoUsd(params.modelo, tokensIn, tokensOut);
  const { error } = await admin.from("ai_calls").insert({
    user_id: params.userId,
    job_id: params.jobId,
    modelo: params.modelo,
    tokens_in: tokensIn,
    tokens_out: tokensOut,
    costo_usd,
  });
  if (error) console.error("[budget] no se pudo registrar el gasto", error.message);
}

export async function liberarReserva(reservaId: string) {
  const { error } = await createAdminClient().from("ai_calls").delete().eq("id", reservaId);
  if (error) console.error("[budget] no se pudo liberar la reserva", error.message);
}

export function limitesDeUso() {
  const env = getEnv();
  return {
    reservaUsd: env.AI_RESERVA_USD,
    limiteDia: env.AI_DAILY_BUDGET_USD,
    limiteMes: env.AI_MONTHLY_BUDGET_USD,
    maxTrial: env.MAX_VIDEOS_TRIAL,
    maxMes: env.MAX_VIDEOS_MES,
    costoTrial: env.MAX_COSTO_TRIAL_USD,
    costoMensual: env.MAX_COSTO_MENSUAL_USD,
    costoAnual: env.MAX_COSTO_ANUAL_USD,
  };
}
