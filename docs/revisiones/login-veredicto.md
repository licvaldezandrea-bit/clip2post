# VEREDICTO revisor-visual — login
Fecha: 2026-09-22 12:00
Screenshot: docs/revisiones/login-375.png (estado inicial; estado "correo enviado"/OTP evaluado por código, no verificado en imagen)
Usabilidad: 38/40 (h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:4 h8:3 h9:4 h10:4)
Craft: 19/20 (jerarquía:4 profundidad:4 identidad:4 movimiento:4 encaje:3)
Copy (si vende): N-A (login no vende)
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Consistencia, resentMsg] `#resentMsg` se muestra/oculta con `style.display` inline en JS mientras el resto del archivo (rescue-box, form-wrap, sent) fue unificado esta misma pasada al patrón de clases `.show`/`.hide` → inconsistencia nueva introducida en la propia corrección. Fix: agregar clase `.show`/`.hide` para `#resentMsg`.
2. [Layout] `main` centra verticalmente con flex, dejando franjas vacías grandes arriba y abajo en 375×812 (visible en el screenshot) → sensación de pantalla "flotante"/vacía. Fix: anclar el contenido más arriba (`justify-content:flex-start` + padding-top fijo).
3. [OTP, paste] No hay manejo del evento `paste` en los inputs OTP → si el usuario pega el código de 6 dígitos de una vez (común desde SMS/portapapeles), probablemente solo el primer input recibe el valor. Fix: distribuir el valor pegado entre los 6 inputs.
4. [Google OAuth] El botón "Continuar con Google" no tiene estado de carga/disabled mientras se procesa, a diferencia del botón de email que sí usa `.loading` → feedback inconsistente entre los dos métodos de entrada. Fix: aplicar el mismo patrón de loading state.
5. [Rescate] El mensaje de la caja de rescate es genérico y no distingue si el correo comprado difiere del que se intentó usar. Menor, aceptable por ahora.
