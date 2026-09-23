// Circuit-breaker por proveedor: si falla repetido, deja de martillarlo (open) y
// prueba UNA vez tras el cooldown (half-open) antes de confiar de nuevo (closed).
// Mitigación por instancia (en serverless no comparte estado entre instancias) —
// la protección global real es el kill-switch de gasto en DB (lib/budget.ts).
// Fuente canónica: docs/sistema/30-INTEGRACION-IA.md
export class CircuitBreaker {
  private failures = 0;
  private state: "closed" | "open" | "half-open" = "closed";
  private openedAt = 0;

  constructor(
    private threshold = 5,
    private cooldownMs = 30_000,
  ) {}

  async exec<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.openedAt < this.cooldownMs) {
        throw new Error("circuit-open");
      }
      this.state = "half-open";
    }
    try {
      const out = await fn();
      this.failures = 0;
      this.state = "closed";
      return out;
    } catch (e) {
      this.failures++;
      if (this.state === "half-open" || this.failures >= this.threshold) {
        this.state = "open";
        this.openedAt = Date.now();
      }
      throw e;
    }
  }
}

export async function callWithRetry<T>(fn: () => Promise<T>, max = 3): Promise<T> {
  for (let i = 0; i < max; i++) {
    try {
      return await fn();
    } catch (e: unknown) {
      const status = (e as { status?: number })?.status;
      const name = (e as { name?: string })?.name;
      const retriable = status === 429 || (status ?? 0) >= 500 || name === "TimeoutError";
      if (!retriable || i === max - 1) throw e;
      await new Promise((r) => setTimeout(r, 2 ** i * 1000 + Math.random() * 300));
    }
  }
  throw new Error("unreachable");
}

export const aiBreaker = new CircuitBreaker();
