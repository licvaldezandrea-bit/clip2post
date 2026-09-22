# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-22 13:32
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 38/40
Craft: 20/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1. [Paso 3 - loading] No hay control explícito de cancelar la generación: la única forma de interrumpirla es la flecha atrás del topbar (que sí limpia el timer y vuelve al paso 2 — código verificado en goTo() y backLink listener), pero no está etiquetada como "cancelar" ni hay ningún affordance visible dentro de la pantalla de loading. Defecto menor de h3 (control y libertad del usuario); no bloquea el gate porque la vía de escape existe y funciona. Fix sugerido (no bloqueante): agregar un link de texto "Cancelar" bajo la lista de progreso que llame a goTo(2).
