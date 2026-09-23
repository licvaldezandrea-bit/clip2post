import { createAdminClient } from "@/lib/supabase/admin";
import { getEnv } from "@/lib/env";

// Kill-switch de gasto de IA — dos ventanas (diaria + mensual), leídas de la tabla
// `ai_calls` (que solo el servidor escribe, ver la migración 0001). Se consulta
// ANTES de cada llamada cara a la API. Fuente canónica: docs/sistema/30-INTEGRACION-IA.md
export async function dentroDelPresupuesto(): Promise<{ ok: boolean; motivo?: string }> {
  const env = getEnv();
  const admin = createAdminClient();

  const inicioDia = new Date();
  inicioDia.setUTCHours(0, 0, 0, 0);
  const inicioMes = new Date(Date.UTC(inicioDia.getUTCFullYear(), inicioDia.getUTCMonth(), 1));

  const { data: gastoDia } = await admin
    .from("ai_calls")
    .select("costo_usd")
    .gte("created_at", inicioDia.toISOString());
  const totalDia = (gastoDia ?? []).reduce((acc, r) => acc + Number(r.costo_usd), 0);
  if (totalDia >= env.AI_DAILY_BUDGET_USD) {
    return { ok: false, motivo: "tope DIARIO de IA alcanzado" };
  }

  const { data: gastoMes } = await admin
    .from("ai_calls")
    .select("costo_usd")
    .gte("created_at", inicioMes.toISOString());
  const totalMes = (gastoMes ?? []).reduce((acc, r) => acc + Number(r.costo_usd), 0);
  if (totalMes >= env.AI_MONTHLY_BUDGET_USD) {
    return { ok: false, motivo: "tope MENSUAL de IA alcanzado" };
  }

  return { ok: true };
}

// Precios aproximados por 1M tokens (verificar vigentes antes de confiar en el número
// para facturación real — ver docs/sistema/30-INTEGRACION-IA.md, tabla de modelos).
const PRECIOS_POR_1M: Record<string, { in: number; out: number }> = {
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-haiku-4-5": { in: 1, out: 5 },
  "claude-opus-4-8": { in: 5, out: 25 },
};

export function calcularCostoUsd(modelo: string, tokensIn: number, tokensOut: number): number {
  const precio = PRECIOS_POR_1M[modelo] ?? PRECIOS_POR_1M["claude-sonnet-4-6"];
  return (tokensIn / 1_000_000) * precio.in + (tokensOut / 1_000_000) * precio.out;
}

export async function registrarGasto(params: {
  userId: string;
  jobId?: string;
  modelo: string;
  tokensIn: number;
  tokensOut: number;
}) {
  const admin = createAdminClient();
  const costo_usd = calcularCostoUsd(params.modelo, params.tokensIn, params.tokensOut);
  await admin.from("ai_calls").insert({
    user_id: params.userId,
    job_id: params.jobId,
    modelo: params.modelo,
    tokens_in: params.tokensIn,
    tokens_out: params.tokensOut,
    costo_usd,
  });
}
