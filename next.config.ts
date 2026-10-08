import type { NextConfig } from "next";

const esProduccion = process.env.NODE_ENV === "production";

// CSP: las pantallas son HTML estático con <script>/<style> en línea (se necesita 'unsafe-inline');
// el resto está cerrado a lo que de verdad usa la app: fuentes de Fontshare, Lottie desde cdnjs
// y subidas directas a Supabase Storage. En desarrollo Next necesita 'unsafe-eval', por eso solo
// se aplica en producción.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
  "font-src 'self' https://cdn.fontshare.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://*.supabase.co",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // AGENTS.md de este proyecto es el archivo doctrinal del Sistema Operativo (idéntico a
  // CLAUDE.md) — Next.js le agrega un bloque propio en cada `dev`/`build` si no se desactiva.
  agentRules: false,
  poweredByHeader: false,

  // Las pantallas de producto (landing, onboarding, planes, entrar, app) son HTML estático
  // en /public: se sirven con URLs limpias.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/landing.html" },
        { source: "/onboarding", destination: "/onboarding.html" },
        { source: "/paywall", destination: "/paywall.html" },
        { source: "/login", destination: "/login.html" },
        { source: "/app", destination: "/app.html" },
        { source: "/terminos", destination: "/terminos.html" },
        { source: "/privacidad", destination: "/privacidad.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          ...(esProduccion ? [{ key: "Content-Security-Policy", value: csp }] : []),
        ],
      },
      {
        // Las pantallas protegidas no se cachean en el navegador compartido.
        source: "/app.html",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
    ];
  },
};

export default nextConfig;
