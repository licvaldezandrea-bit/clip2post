# VEREDICTO revisor-visual — landing
Fecha: 2026-09-22 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 37/40
Craft: 18/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA

Top defectos:
1. [global] No hay estilo `:focus-visible` en botones/links/summary (0 coincidencias en el CSS) → añadir outline o box-shadow de foco visible con el acento para navegación por teclado.
2. [carrusel "Así se ve por dentro"] El peek del slide 2 es de ~18% (260px slide, ~67px visible tras padding-inline 24px), en el límite bajo del rango 15-20% pedido — subir a ~72-75px de peek para que el affordance de scroll sea inequívoco en pantallas más angostas.
3. [FAQ] Los ítems colapsados no tienen indicio visual de que son interactivos más allá del chevron pequeño (sin hover/estado táctil visible en estático) — aceptable pero es el eje más débil de craft/usabilidad, considerar aumentar el área de toque percibida (padding del `summary`).
4. [oferta] La comparación "$92/mes valor total" vs "$7.42/mes" es clara, pero el plan mensual de $12.99 queda con menos contraste de urgencia (sin badge, sin ahorro explícito) — podría restar conversión frente al anual, aunque no es un defecto de usabilidad per se.
