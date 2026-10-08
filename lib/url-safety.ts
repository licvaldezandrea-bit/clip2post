// Validación de la URL de audio/video que pega el usuario. La descarga la hace AssemblyAI
// desde sus servidores (no desde los nuestros), pero igual: solo https, sin credenciales,
// sin direcciones internas, y con un mensaje honesto para los links que todavía no soportamos.

const HOSTS_NO_SOPORTADOS = [
  "youtube.com",
  "youtu.be",
  "vimeo.com",
  "tiktok.com",
  "instagram.com",
  "facebook.com",
  "fb.watch",
  "twitter.com",
  "x.com",
  "drive.google.com",
  "dropbox.com",
];

export type ResultadoUrl =
  | { ok: true; url: string }
  | { ok: false; motivo: "invalida" | "no_https" | "interna" | "no_soportada" };

function esIpPrivadaOLocal(host: string): boolean {
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    return true;
  }
  if (host.includes(":")) return true; // IPv6 literal: no lo aceptamos
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

export function validarUrlMedia(entrada: string): ResultadoUrl {
  let u: URL;
  try {
    u = new URL(entrada.trim());
  } catch {
    return { ok: false, motivo: "invalida" };
  }
  if (u.protocol !== "https:") return { ok: false, motivo: "no_https" };
  if (u.username || u.password) return { ok: false, motivo: "invalida" };
  const host = u.hostname.toLowerCase();
  if (esIpPrivadaOLocal(host)) return { ok: false, motivo: "interna" };
  if (HOSTS_NO_SOPORTADOS.some((h) => host === h || host.endsWith("." + h))) {
    return { ok: false, motivo: "no_soportada" };
  }
  return { ok: true, url: u.toString() };
}

export const MENSAJE_URL: Record<Exclude<ResultadoUrl, { ok: true }>["motivo"], string> = {
  invalida: "Ese link no parece válido. Pega la dirección completa o sube el archivo.",
  no_https: "El link tiene que empezar con https://.",
  interna: "Ese link no se puede usar. Pega un link público o sube el archivo.",
  no_soportada:
    "Los links de YouTube y redes todavía no funcionan. Sube el archivo de audio o video directamente.",
};
