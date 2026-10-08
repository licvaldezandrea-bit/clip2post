import { describe, expect, it } from "vitest";
import { hottokValido, parsearEventoHotmart } from "@/lib/hotmart";

const evento = (event: string, extra: Record<string, unknown> = {}) => ({
  id: "evt-1",
  event,
  data: {
    buyer: { email: " Ana@Ejemplo.com " },
    purchase: { transaction: "HP123", offer: { code: "OFERTA_ANUAL" }, approved_date: Date.UTC(2026, 0, 10) },
    subscription: { subscriber: { code: "SUB1" } },
    ...extra,
  },
});

describe("hottokValido", () => {
  it("acepta el token correcto", () => expect(hottokValido("abc123", "abc123")).toBe(true));
  it("rechaza uno incorrecto", () => expect(hottokValido("abc124", "abc123")).toBe(false));
  it("rechaza si falta el token recibido", () => expect(hottokValido(null, "abc123")).toBe(false));
  it("rechaza TODO si el servidor no tiene token configurado (fail-closed)", () =>
    expect(hottokValido("abc123", undefined)).toBe(false));
});

describe("parsearEventoHotmart", () => {
  it("compra aprobada de la oferta anual activa plan anual con ~1 año + 3 días de gracia", () => {
    const r = parsearEventoHotmart(evento("PURCHASE_APPROVED"), ["OFERTA_ANUAL"]).resultado;
    expect(r.accion).toBe("activar");
    if (r.accion !== "activar") return;
    expect(r.plan).toBe("anual");
    expect(r.email).toBe("ana@ejemplo.com");
    expect(r.suscripcion).toBe("SUB1");
    expect(r.hasta.toISOString().slice(0, 10)).toBe("2027-01-13");
  });

  it("una oferta que no es anual activa plan mensual", () => {
    const r = parsearEventoHotmart(evento("PURCHASE_COMPLETE"), ["OTRA"]).resultado;
    expect(r.accion === "activar" && r.plan).toBe("mensual");
  });

  it("usa la fecha del próximo cobro cuando Hotmart la manda", () => {
    const r = parsearEventoHotmart(
      evento("PURCHASE_APPROVED", {
        purchase: { transaction: "HP1", approved_date: Date.UTC(2026, 0, 10), date_next_charge: Date.UTC(2026, 1, 10) },
      }),
      [],
    ).resultado;
    expect(r.accion === "activar" && r.hasta.toISOString().slice(0, 10)).toBe("2026-02-13");
  });

  it.each(["PURCHASE_REFUNDED", "PURCHASE_CHARGEBACK", "SUBSCRIPTION_CANCELLATION", "PURCHASE_CANCELED"])(
    "%s cancela el plan",
    (e) => {
      expect(parsearEventoHotmart(evento(e), []).resultado).toEqual({ accion: "cancelar", email: "ana@ejemplo.com" });
    },
  );

  it("ignora eventos que no cambian el acceso", () => {
    expect(parsearEventoHotmart(evento("PURCHASE_OUT_OF_SHOPPING_CART"), []).resultado.accion).toBe("ignorar");
  });

  it("ignora un evento sin email válido", () => {
    const p = { id: "x", event: "PURCHASE_APPROVED", data: { buyer: { email: "no-es-email" } } };
    expect(parsearEventoHotmart(p, []).resultado).toEqual({ accion: "ignorar", motivo: "sin_email" });
  });

  it("genera un id estable si el evento no trae id (idempotencia)", () => {
    const sinId = { event: "PURCHASE_APPROVED", data: { buyer: { email: "a@b.co" }, purchase: { transaction: "HP9" } } };
    const a = parsearEventoHotmart(sinId, []).eventId;
    const b = parsearEventoHotmart(sinId, []).eventId;
    expect(a).toBe(b);
    expect(a).toHaveLength(64);
  });
});
