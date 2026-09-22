# FICHA DE DIRECCIÓN DE ARTE — Clip2Post

## Referencia del usuario (CONTRATO — ver 16)
- ¿Hay imagen(es) de referencia del usuario?: NO → ruta 1 (propuesta propia, PROTOCOLO A/B/C)
- Prohibiciones anti-IA que la referencia LEVANTA: N/A — sin referencia, aplica la capa anti-IA completa (sin fondo #000 puro, sin glow, sin glass sobre contenido)

## Identidad derivada (FUSIÓN de líderes — 16 PASO 0.2bis)
- TABLA DE LÍDERES:

| App | Tipografía real → equivalente | Lógica de color | Radius y cards | Navegación | UN patrón robable |
|---|---|---|---|---|---|
| OpusClip (app modelo) | Geist → Switzer (equivalente, evita fuente quemada) | negro puro + blanco + un botón invertido pill | 8-10px, glass sutil (rgba blanco .1) | topbar simple | pill button invertido (bg claro/texto oscuro) como CTA principal |
| Linear | Inter Variable → Switzer | casi-negro CON TINTE (#08090A, no #000) + acento índigo #5E6AD2, glass sutil en overlays | 8px cards, 9999px pills | topbar + sidebar | acento índigo único, sobrio, sin glow |
| Descript (giant admirado, otro nicho) | booton/brett custom → (no se usa en A; alimentó direcciones B/C) | crema cálido + wine/coral | 12px cards | topbar | tono editorial cálido (no usado en A elegida) |

- Combinación tipográfica probada usada: fila "Productividad / B2B" de 29 (Geist/General Sans/Switzer, misma familia display+body) · validada contra líderes: SÍ (Linear y OpusClip usan la misma lógica)
- Arquetipo: Sabio confiable · Mundo del sujeto (0.45): una fuente (el video) se transforma en 3 salidas especializadas — el dispositivo ownable nace de ahí
- Dirección del banco 54 usada para el DISPOSITIVO OWNABLE: propia (justificada por el mundo del sujeto, no hay dirección de banco exacta para "1 fuente → 3 salidas") — tags de color por red social (LinkedIn/X/Instagram) junto a cada pieza generada, con el índigo de marca reservado SOLO para acciones/CTA · Líder de origen de la paleta (tomada tal cual, sin desafinar hue): Linear (índigo #5E6AD2, ligeramente ajustado a #8B8FF5 para más contraste en el negro tintado más oscuro de Clip2Post)

## Personalidad compilada
- 3 adjetivos: confiable, eficiente, autoritativa (sin ser fría)
- Compilación: spring suave (deceleration, sin rebote — un consultor no quiere que su herramienta "juegue") · duración base 220ms · exclamaciones máx 1/pantalla (el momento del resultado) · celebración nivel bajo-medio (sutil, profesional — nunca confetti) · radio tendencial 12px (cards) / 999px (pills y CTAs)

## Brand kit final (valores para globals.css/@theme)
- Fondo: #0C0D10 · Superficie: #15161B · Hundido: #090A0C · Texto 1º: #F1F2F4 · Texto 2º: #9A9CA6
- Acento: #8B8FF5 (índigo — SOLO en: CTA primario, tag de red activa, estados de foco/selección)
- 2ª nota: #E8B354 (ámbar cálido — SOLO en: badge de plan Pro, hitos/rachas — nunca en botones de acción)
- Semánticos: éxito #34D399 · error #F87171 · aviso #FBBF24
- Display: Switzer (pesos 600/700) · Body: Switzer (pesos 400/500) · Escala: display 28px / title 20px / body 14px / label 11px
- Radio: 12px (cards) · 999px (pills, botones, avatares) · Profundidad: 3 niveles por luminancia (fondo/superficie/hundido) + bordes rgba(255,255,255,.06), sin sombras duras · Espaciado base: 4·8·12·16·24·32·48·64
- Dispositivo ownable: tags de color por red social (LinkedIn azul #0A66C2 solo como tag, X negro/blanco, Instagram degradé solo en el tag — nunca en UI general) junto a cada pieza de contenido generada
- Motion signature: easing cubic-bezier(.2,.8,.2,1) · stagger 60ms entre cards al terminar de generar · firma: cada card de resultado entra con fade + slide-up 8px, secuencial por red (LinkedIn → X → Instagram)

## Trazabilidad y vetos
- Ruta de diseño: propuesta propia (Protocolo A/B/C)
- Protocolo A/B/C: opción elegida A ("Estudio Confiable") · descartadas: B (Estudio Creativo — crema/coral, más cálida y menos corporativa) y C (Estudio Editorial — serif/papel, más "publicación" que "herramienta") · página comparativa: `direcciones-abc.html` (raíz del proyecto; también publicada como Artifact: https://claude.ai/artifact/VJaaiQ5gyftZjEfjn5qhmA) · screenshot: `docs/revisiones/direcciones-abc.png`
- Tour de la app: `vista-previa-app.html` (raíz del proyecto; también Artifact: https://claude.ai/artifact/VYJ33yEf9o8ZWwqshDygzX) · screenshot: `docs/revisiones/vista-previa-app.png` · vistas incluidas: landing, onboarding, paywall, mecanismo (app interna) · aprobado por el usuario: pendiente de confirmación explícita (se le presenta junto con esta ficha)
- Paleta derivada de: líder de origen Linear (índigo #5E6AD2 → #8B8FF5, tomado de su misma lógica de color) · Dispositivo ownable elegido: tags de red social por color
- Registro anti-repetición: paleta índigo-sobre-negro-tintado + par tipográfico Switzer/Switzer quedan VETADOS para el próximo proyecto de este SO
- Modo (claro/oscuro) DERIVADO por: los 2 líderes principales del nicho exacto (OpusClip, Linear) usan oscuro tintado — coherente con "herramienta seria para mostrar a clientes"

## Idioma UI: Español latino neutro · Fecha de cierre de la ficha: 2026-09-22 · Aprobada por el usuario: SÍ (eligió opción A del Artifact)
