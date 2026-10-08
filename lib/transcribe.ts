import { getEnv } from "@/lib/env";
import { callWithRetry } from "@/lib/circuit-breaker";

// Transcripción voz→texto con AssemblyAI (decisión técnica documentada en ESTADO.md).
// Corre solo en el servidor (BFF): la clave nunca llega al navegador.
// Acepta una URL https pública (un archivo subido por el usuario llega como URL firmada
// de Supabase Storage). Los links de YouTube no se soportan todavía (ver lib/url-safety.ts).
const BASE = "https://api.assemblyai.com/v2";

class HttpError extends Error {
  constructor(
    public status: number,
    mensaje: string,
  ) {
    super(mensaje);
  }
}

export async function transcribeAudio(
  audioUrl: string,
  señal?: AbortSignal,
): Promise<{ texto: string; duracionSeg: number }> {
  const env = getEnv();
  const headers = { authorization: env.ASSEMBLYAI_API_KEY, "content-type": "application/json" };

  const { id } = await callWithRetry(async () => {
    const res = await fetch(`${BASE}/transcript`, {
      method: "POST",
      headers,
      body: JSON.stringify({ audio_url: audioUrl, language_detection: true }),
      signal: señal,
    });
    if (!res.ok) throw new HttpError(res.status, `AssemblyAI rechazó el trabajo (${res.status})`);
    return (await res.json()) as { id: string };
  });

  // Poll cada 3s. Tope ~4 min: si un video lo supera, la ruta responde con un error claro
  // (para videos largos hace falta el worker asíncrono, ver ESTADO.md).
  const inicio = Date.now();
  const TIMEOUT_MS = 4 * 60 * 1000;
  while (Date.now() - inicio < TIMEOUT_MS) {
    const poll = await fetch(`${BASE}/transcript/${id}`, { headers, signal: señal });
    if (!poll.ok) throw new HttpError(poll.status, `AssemblyAI no respondió (${poll.status})`);
    const data = (await poll.json()) as {
      status: string;
      text?: string;
      error?: string;
      audio_duration?: number;
    };

    if (data.status === "completed") {
      return { texto: data.text ?? "", duracionSeg: data.audio_duration ?? 0 };
    }
    if (data.status === "error") throw new Error(`AssemblyAI falló: ${data.error}`);

    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error("TIMEOUT_TRANSCRIPCION");
}

export function costoTranscripcionUsd(duracionSeg: number): number {
  return (duracionSeg / 3600) * getEnv().ASSEMBLYAI_USD_PER_HOUR;
}
