import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const base = {
  NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "pub",
  SUPABASE_URL: "https://x.supabase.co",
  SUPABASE_SECRET_KEY: "sec",
  ANTHROPIC_API_KEY: "ak",
  ASSEMBLYAI_API_KEY: "aai",
};

describe("getEnv", () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => vi.unstubAllEnvs());

  async function cargar(vars: Record<string, string>) {
    for (const [k, v] of Object.entries(vars)) vi.stubEnv(k, v);
    return (await import("@/lib/env")).getEnv();
  }

  it("las variables opcionales vacías cuentan como no configuradas (no tumban la app)", async () => {
    const env = await cargar({ ...base, AI_MODEL_FALLBACK: "", HOTMART_HOTTOK: "", HOTMART_ANNUAL_OFFER_CODES: "" });
    expect(env.HOTMART_HOTTOK).toBeUndefined();
    expect(env.AI_MODEL_FALLBACK).toBeUndefined();
  });

  it("los números vacíos usan su valor por defecto", async () => {
    const env = await cargar({ ...base, AI_DAILY_BUDGET_USD: "", MAX_VIDEOS_TRIAL: "" });
    expect(env.AI_DAILY_BUDGET_USD).toBe(20);
    expect(env.MAX_VIDEOS_TRIAL).toBe(3);
  });

  it("si falta una clave obligatoria, falla con un mensaje claro (fail-closed)", async () => {
    const { ANTHROPIC_API_KEY, ...sinClave } = base;
    void ANTHROPIC_API_KEY;
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    await expect(cargar(sinClave)).rejects.toThrow(/ANTHROPIC_API_KEY/);
  });
});
