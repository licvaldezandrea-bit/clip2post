import { describe, expect, it } from "vitest";
import { validarUrlMedia } from "@/lib/url-safety";

describe("validarUrlMedia", () => {
  it("acepta un https público", () => {
    expect(validarUrlMedia("https://ejemplo.com/audio.mp3")).toEqual({ ok: true, url: "https://ejemplo.com/audio.mp3" });
  });

  it("rechaza http", () => {
    expect(validarUrlMedia("http://ejemplo.com/a.mp3")).toMatchObject({ ok: false, motivo: "no_https" });
  });

  it.each([
    "https://localhost/a.mp3",
    "https://127.0.0.1/a.mp3",
    "https://10.0.0.5/a.mp3",
    "https://192.168.1.10/a.mp3",
    "https://172.16.4.1/a.mp3",
    "https://169.254.169.254/latest/meta-data",
    "https://servicio.internal/a.mp3",
    "https://[::1]/a.mp3",
  ])("rechaza direcciones internas: %s", (u) => {
    expect(validarUrlMedia(u)).toMatchObject({ ok: false, motivo: "interna" });
  });

  it("rechaza credenciales embebidas", () => {
    expect(validarUrlMedia("https://usuario:clave@ejemplo.com/a.mp3")).toMatchObject({ ok: false, motivo: "invalida" });
  });

  it.each(["https://www.youtube.com/watch?v=abc", "https://youtu.be/abc", "https://vimeo.com/123"])(
    "avisa con claridad que %s no está soportado todavía",
    (u) => {
      expect(validarUrlMedia(u)).toMatchObject({ ok: false, motivo: "no_soportada" });
    },
  );

  it("rechaza texto que no es una URL", () => {
    expect(validarUrlMedia("hola")).toMatchObject({ ok: false, motivo: "invalida" });
  });
});
