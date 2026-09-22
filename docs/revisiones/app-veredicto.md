# VEREDICTO revisor-visual — app (pantalla principal)
Fecha: 2026-09-22 00:00
Screenshot: docs/revisiones/app-375.png
Usabilidad: 36/40
Craft: 18/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1. [topbar] avatar "C" mide 44x44px, por debajo del táctil ideal de 48px para acción secundaria frecuente → subir a 48x48px. 2. [modal generando] la barra de progreso (ring) corre en un timeout fijo de 2.4s desconectado del estado real de subida/procesamiento → cuando conecte backend real, atar el dashoffset a progreso real. 3. [Cuenta] "Tono de las piezas" y "Facturación" muestran toast informativo en vez de navegar a una pantalla real — aceptable para este corte pero documentar que son placeholders de Sesión 6. 4. [Piezas] con 9 tarjetas sin filtro activo se supera el umbral de 8-10 ítems recomendado antes de paginar — vigilar cuando crezca el catálogo real. 5. [Inicio] buen manejo de teclado ya verificado (vcards + avatar con role/tabindex/keydown); sin más bloqueantes visibles.
