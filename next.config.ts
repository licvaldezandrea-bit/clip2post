import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md de este proyecto es el archivo doctrinal del Sistema Operativo (idéntico a
  // CLAUDE.md) — Next.js le agrega un bloque propio en cada `dev`/`build` si no se desactiva.
  agentRules: false,
};

export default nextConfig;
