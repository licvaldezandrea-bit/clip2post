import type { ReactNode } from "react";

// Pantalla simple de mensaje (errores / no encontrado) con la identidad de Clip2Post.
// Colores = tokens de FICHA-ARTE (carbón-marrón cálido + naranja solo en la acción).
type Props = {
  titulo: string;
  texto: string;
  accion?: { texto: string; onClick?: () => void; href?: string };
  extra?: ReactNode;
};

const estiloBoton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 52,
  padding: "0 28px",
  borderRadius: 999,
  background: "var(--accent)",
  color: "var(--bg)",
  fontWeight: 700,
  fontSize: 15,
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
} as const;

export function PantallaMensaje({ titulo, texto, accion, extra }: Props) {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "24px 20px",
        textAlign: "center",
        background: "var(--bg)",
        color: "var(--text-1)",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, maxWidth: "20ch" }}>{titulo}</h1>
      <p style={{ margin: 0, color: "var(--text-2)", fontSize: 15, lineHeight: 1.55, maxWidth: "34ch" }}>{texto}</p>
      {accion &&
        (accion.href ? (
          <a href={accion.href} style={estiloBoton}>
            {accion.texto}
          </a>
        ) : (
          <button onClick={accion.onClick} style={estiloBoton}>
            {accion.texto}
          </button>
        ))}
      {extra}
    </main>
  );
}
