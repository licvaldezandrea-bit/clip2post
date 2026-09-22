# VEREDICTO revisor-visual — landing
Fecha: 2026-09-22 (pasada 6)
Screenshot: docs/revisiones/landing-375.png (+ parts 1-4)
Usabilidad: 36/40
Craft: 18/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N/A (sin referencia del usuario)
Veredicto: LISTA

Detalle:
USABILIDAD: 36/40 (h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:4 h9:3 h10:3)
CRAFT: 18/20 (jerarquía:4 profundidad:3 identidad:4 movimiento:4 encaje:3)
COPY: 19/20 (idea:4 especificidad:4 emoción:4 oferta:4 acción:3)

Top defectos aplicados en un pase de pulido posterior (stroke-width unificado a 1.8, ícono $3K-10K cambiado a tendencia descendente, contraste de la flecha del diagrama de flujo subido con color-mix hacia el acento) — no se volvió a correr una 7ª revisión por ser cambios aditivos de bajo riesgo sobre un veredicto ya LISTA.
Top defectos:
1. [Global, todos los íconos SVG nuevos] Tres grosores de trazo distintos conviven en la página (stroke-width 2 en qcards de Agitación-preguntas, 1.6 en stats/Antes-Después, 1.8 en el diagrama de flujo) → fix: unificar a un único stroke-width (ej. 1.75) en todos los `<svg class="icon">`/`.agit-ic`/`.dot svg`.
2. [Agitación, 3ra tarjeta "$3K-10K"] El ícono (signo de dólar tachado) no lee como "tendencia" a primera vista, es el menos inequívoco de las 3 stats → fix: si se busca reforzar "tendencia" cambiar a un ícono de flecha/gráfico descendente; si el foco es "dinero perdido" dejarlo pero verificar con un usuario real.
3. [Sección Solución, diagrama de flujo] El degradé del ícono de Instagram usa 4 stops de colores de marca real (feda75→fa7e1e→d62976→4f5bd5), el punto de mayor saturación cromática de toda la página — está justificado por FICHA-ARTE línea 32 ("Instagram degradé solo en el tag") pero conviene no repetir ese tratamiento fuera de este uso puntual de identificación de red.
4. [Diagrama de flujo] La flecha entre "Tu video" y las 3 salidas es fina y de bajo contraste (var(--text-2)) — funciona pero es el elemento más débil visualmente del propio dispositivo ownable → fix: opcional, subir opacidad/color levemente si se detecta que el usuario no sigue la lectura izquierda→derecha.
5. [Cajas Antes/Después] Ícono "antes" (reloj) en gris y "después" (rayo) en naranja — el contraste de color entre ambos íconos es el único lugar donde se usa gris puro `var(--text-2)` como color de ícono en vez de tratarlo como neutro de fondo; correcto conceptualmente (antes=neutro, después=marca) pero queda algo apagado junto al resto de íconos naranjas de la página.

Evaluación de los elementos nuevos (íconos de stats, diagrama de flujo, íconos Antes/Después):
- No rompen jerarquía: son decorativos/pequeños (22-56px), subordinados a titulares y cifras grandes.
- Encaje óptico: alineados, mismo radio/fondo `--hundido` + borde sutil en los círculos, buen espaciado — con la salvedad del stroke-width inconsistente entre familias de íconos (defecto 1).
- Degradé de Instagram: se renderiza correctamente como degradé real (verificado en screenshot y en render en vivo) — no aparece vacío/roto.
- Capa anti-IA: sin glow, sin sombras duras, sin colores fuera de la paleta aprobada (naranja acento, gris texto-2, azul/blanco/degradé reservados solo como tags de red social, tal como especifica FICHA-ARTE línea 32).
- Identidad ownable (eje 3 craft): el diagrama de flujo materializa visualmente el dispositivo ya aprobado en FICHA-ARTE ("1 fuente → 3 salidas", tags de color por red social) — suma a la identidad en vez de diluirla.
