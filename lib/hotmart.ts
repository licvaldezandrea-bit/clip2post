import { createHash, timingSafeEqual } from "node:crypto";

// Lógica PURA del webhook de Hotmart (sin I/O) para poder probarla con tests.
// Formato v2.0 del webhook; el `hottok` llega en el header X-HOTMART-HOTTOK (o en el body, versiones viejas).

export type AccionPago =
  | { accion: "activar"; email: string; plan: "anual" | "mensual"; hasta: Date; suscripcion: string | null }
  | { accion: "cancelar"; email: string }
  | { accion: "ignorar"; motivo: string };

export type ParseoPago = { eventId: string; evento: string; resultado: AccionPago };

const EVENTOS_ACTIVAR = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
const EVENTOS_CANCELAR = new Set([
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_CANCELED",
  "SUBSCRIPTION_CANCELLATION",
]);
const GRACIA_DIAS = 3; // margen por si el cobro de renovación se demora

export function hottokValido(recibido: string | null | undefined, esperado: string | undefined): boolean {
  if (!esperado || !recibido) return false;
  const a = createHash("sha256").update(recibido).digest();
  const b = createHash("sha256").update(esperado).digest();
  return timingSafeEqual(a, b);
}

type Payload = {
  id?: string;
  event?: string;
  data?: {
    buyer?: { email?: string };
    purchase?: {
      transaction?: string;
      offer?: { code?: string };
      approved_date?: number;
      date_next_charge?: number;
      recurrence_number?: number;
    };
    subscription?: { subscriber?: { code?: string } };
  };
};

export function parsearEventoHotmart(payload: unknown, codigosAnuales: string[]): ParseoPago {
  const p = (payload ?? {}) as Payload;
  const evento = String(p.event ?? "");
  const transaccion = p.data?.purchase?.transaction ?? "";
  const eventId = p.id ?? createHash("sha256").update(`${evento}:${transaccion}`).digest("hex");
  const email = (p.data?.buyer?.email ?? "").trim().toLowerCase();

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { eventId, evento, resultado: { accion: "ignorar", motivo: "sin_email" } };
  }

  if (EVENTOS_CANCELAR.has(evento)) {
    return { eventId, evento, resultado: { accion: "cancelar", email } };
  }

  if (EVENTOS_ACTIVAR.has(evento)) {
    const codigoOferta = p.data?.purchase?.offer?.code ?? "";
    const plan: "anual" | "mensual" = codigosAnuales.includes(codigoOferta) ? "anual" : "mensual";
    const base = p.data?.purchase?.approved_date ? new Date(p.data.purchase.approved_date) : new Date();
    const proximoCobro = p.data?.purchase?.date_next_charge ? new Date(p.data.purchase.date_next_charge) : null;
    const hasta = new Date(proximoCobro ?? base);
    if (!proximoCobro) {
      if (plan === "anual") hasta.setFullYear(hasta.getFullYear() + 1);
      else hasta.setMonth(hasta.getMonth() + 1);
    }
    hasta.setDate(hasta.getDate() + GRACIA_DIAS);
    return {
      eventId,
      evento,
      resultado: {
        accion: "activar",
        email,
        plan,
        hasta,
        suscripcion: p.data?.subscription?.subscriber?.code ?? null,
      },
    };
  }

  return { eventId, evento, resultado: { accion: "ignorar", motivo: "evento_no_relevante" } };
}
