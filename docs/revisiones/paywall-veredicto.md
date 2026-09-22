# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-22 12:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 37/40 (h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:4 h8:3 h9:4 h10:3)
Craft: 19/20 (jerarquía:4 profundidad:4 identidad:4 movimiento:4 encaje:3)
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Planes, accesibilidad] `.plan` son `<div>` con `onclick`, sin `role="radio"`, sin `tabindex` ni manejo de teclado → un usuario de teclado no puede cambiar de plan. Fix: usar `<input type="radio">` reales o `role="radio"` + `tabindex` + Enter/Espacio.
2. [Garantía vs. fine print] El bloque de confianza dice "sin tarjeta hoy... cancelas y no pagas nada" (trial sin cobro) y el fine print bajo el CTA dice "garantía de devolución de 7 días" (implica que sí se cobra y se reembolsa) → mensajes contradictorios sobre si se cobra o no. Fix: unificar el lenguaje de garantía.
3. [Beneficios, craft] `<b>Título</b>descripción` sin espacio en el HTML; el salto de línea depende solo de `display:block` en CSS → frágil y potencialmente ilegible si el CSS falla o un lector de pantalla ignora el display. Fix: usar salto real (`<br>` o párrafo aparte) en vez de depender del `display:block`.
4. [Copy] Ninguna frase obligatoria de FICHA-AVATAR.md ("tu voz", "listo para copiar y pegar") aparece textual; solo paráfrasis cercanas ("el que suena a ti", "tú revisas y copias"). Fix: incorporar al menos una frase textual validada del avatar.
5. [Densidad] recap + h1 + 2 subtítulos + 3 beneficios + garantía + 2 planes + 2 líneas de confianza + CTA + fine print + skip acumulados en 375px exigen scroll largo antes de ver ambos planes. Fix: evaluar fusionar los dos "sub" (qué desbloqueo / qué pierdo) en uno solo.
