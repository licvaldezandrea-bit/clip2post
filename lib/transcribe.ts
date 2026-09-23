import { getEnv } from "@/lib/env";
import { callWithRetry } from "@/lib/circuit-breaker";

// Transcripción voz→texto con AssemblyAI (decisión técnica documentada en ESTADO.md).
// AssemblyAI acepta una URL de audio/video pública o un archivo subido a su endpoint
// /upload — nunca recibe la clave del cliente: esto corre solo en el servidor (BFF).
//
// LÍMITE ACTUAL (documentado, no oculto): solo transcribe un audioUrl real (un archivo
// que el usuario subió a Supabase Storage, o una URL directa a un .mp3/.mp4 público).
// Pegar un link de YouTube todavía NO funciona: haría falta un paso extra para bajar
// el audio de ese video primero, que no está construido en esta sesión (ver ESTADO.md).
const BASE = "https://api.assemblyai.com/v2";

export async function transcribeAudio(audioUrl: string): Promise<string> {
  const env = getEnv();
  const headers = { authorization: env.ASSEMBLYAI_API_KEY, "content-type": "application/json" };

  const submit = await callWithRetry(() =>
    fetch(`${BASE}/transcript`, {
      method: "POST",
      headers,
      body: JSON.stringify({ audio_url: audioUrl, language_code: "es" }),
    }),
  );
  if (!submit.ok) {
    throw new Error(`AssemblyAI rechazó el trabajo: ${submit.status} ${await submit.text()}`);
  }
  const { id } = (await submit.json()) as { id: string };

  // Poll con backoff simple. Timeout total ~5 min — un video largo puede tardar más;
  // si eso pasa seguido, mover esto a un worker real (ver 30-INTEGRACION-IA.md).
  const inicio = Date.now();
  const TIMEOUT_MS = 5 * 60 * 1000;
  while (Date.now() - inicio < TIMEOUT_MS) {
    const poll = await fetch(`${BASE}/transcript/${id}`, { headers });
    const data = (await poll.json()) as { status: string; text?: string; error?: string };

    if (data.status === "completed") return data.text ?? "";
    if (data.status === "error") throw new Error(`AssemblyAI falló: ${data.error}`);

    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error("Timeout esperando la transcripción");
}
