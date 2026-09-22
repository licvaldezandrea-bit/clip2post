# ESTADO — Clip2Post
Última actualización: 2026-09-22 | Sesión actual: 5

⏸️ CHECKPOINT — Última acción completada: Sesión 5 completa — app.html (app interna: Inicio/M0 con dato de la semana + CTA de 1 tap + insight en voz del mecanismo, Piezas con filtro por red y por video, Cuenta) construida y verificada por revisor-visual (7 pasadas) — VEREDICTO LISTA: Usabilidad 36/40, Craft 18/20 (ver docs/revisiones/app-veredicto.md) / Siguiente acción exacta: responder el feedback externo del usuario sobre el paywall (compartió un análisis de Gemini) y, tras su aprobación, avanzar a Sesión 6 (integraciones reales y seguridad).

## Qué es esta app (3 líneas máximo)
Plataforma web que convierte un video/podcast largo en publicaciones listas para LinkedIn, hilo de X y estructura de carrusel de Instagram, con el tono de cada red. Usuario: consultores B2B, coaches y creadores independientes que graban contenido pero no tienen tiempo de adaptarlo a cada plataforma. Monetización: suscripción mensual/anual.

## Promesa central
"Esta app ayuda a consultores y creadores B2B a mantener presencia profesional en LinkedIn, X e Instagram sin perder horas reescribiendo, convirtiendo el contexto de sus videos en texto persuasivo listo para copiar y pegar en menos de 2 minutos."

## Reporte de validación (Sesión 1) — ya investigado por el usuario, NO re-validar
- Veredicto: Excelente oportunidad (nota 87/100 en investigación previa)
- Competidores: OpusClip/Munch (solo cortan video vertical, no generan copy) · Castmagic (caro, enfocado en podcast/audio) · generadores genéricos de IA (texto robótico)
- Lo que odian de la competencia (nuestra oportunidad): texto genérico "de bot", no entienden estructura nativa de cada red, no resuelven el copy sino solo el video
- Brecha: baja saturación en "conversión inteligente de contexto a texto optimizado por red" (vs alta saturación en recorte de video)
- Precio de referencia del mercado: US$29-99/mes (competencia) — nuestro precio propuesto: US$12.99/mes o US$89/año

## Dirección de Arte (Sesión 2 — NO cambiar sin justificación)
> La ficha COMPLETA vive en `FICHA-ARTE.md` en la raíz. Aquí solo el resumen + registro anti-repetición.
- FICHA-ARTE.md: existe — dirección elegida por el usuario: SÍ (opción A) — 2026-09-22. Cierre final pendiente de confirmar el tour.
- ¿Hubo referencia visual del usuario?: NO → fusión de líderes (OpusClip + Linear), Protocolo A/B/C
- Resumen: fondo #1A140D (carbón-marrón cálido) · superficie #241C13 · acento #FF7A33 (naranja) · 2ª nota #E8B354 (ámbar) · Display "Switzer" · Body "Switzer" · radio 12px (cards) / 999px (pills)
- Personalidad: confiable · eficiente · autoritativa (sin ser fría)
- Dispositivo ownable: tags de color por red social (LinkedIn/X/Instagram) junto a cada pieza generada
- REGISTRO ANTI-REPETICIÓN (29/54): paleta naranja-sobre-carbón-cálido + par tipográfico Switzer/Switzer quedan VETADOS para el próximo proyecto del SO. Dirección del banco 54: N/A (dispositivo propio, justificado en la ficha)
- Entregables en el repo: `direcciones-abc.html` + `vista-previa-app.html` (raíz, construidos desde el kit oficial `plantillas-codigo/direcciones-abc/plantilla.html`) · screenshots en `docs/revisiones/`

## Avatar y venta (Sesión 1/3 — NO cambiar sin validar)
- FICHA-AVATAR.md: existe y aprobada — 2026-09-22 (Carlos, 34 años, consultor B2B / creador independiente de alto valor)
- Dolor #1: pierde 4-8h/semana adaptando un video a texto para cada red; termina publicando "basura robótica" o no publica
- Deseo #1: pegar un link y tener el post de LinkedIn + hilo de X + carrusel IG listos en 60 segundos, sonando 100% como él
- Nivel de consciencia: 4/5 (consciente de la solución, escéptico de la calidad de la IA)
- Objeción principal: "¿va a sonar a robot?" / "¿ya pago ChatGPT, para qué esto?"
- Mecanismo bautizado: "El Multiplicador de Voz" (aparece en hero, sección solución y oferta de la landing)
- Big Idea: "No dejas de publicar por pereza — dejas de publicar porque cada red exige reescribir todo de nuevo. El Multiplicador de Voz toma tu video una sola vez y lo convierte en post de LinkedIn + hilo de X + carrusel IG, sonando como tú."
- Landing: `landing.html` en la raíz — 10 secciones canónicas construidas, carrusel de sección 5 con mini-demo honesto (marcado como vista previa del mecanismo, no screenshots reales — se reemplaza en Sesión 5) · sin testimonios (aún no hay 3 reales) · revisión independiente: LISTA (37/40 · 18/20 · 19/20) — ver `docs/revisiones/landing-veredicto.md` y screenshots `docs/revisiones/landing-375*.png`

## MVP — funciones núcleo
1. Importar video/audio o pegar enlace/transcripción
2. Generador de post de LinkedIn con hook + CTA
3. Generador de hilo de X (separado por tweets)
4. Generador de estructura de carrusel de Instagram (texto por diapositiva)
5. Copiar en 1 clic
- NO construir todavía: auto-posting a redes, editor de video pesado, panel de analíticas multiusuario

## Estrategia de monetización (Sesión 1 — NO cambiar sin validar)
- Modelo: Onboarding-first (Modelo 2, categoría "IA Creativa/Contenido" de 02C) — 1ª generación (preview) gratis → paywall para desbloquear exportar/copiar y generar más.
- Justificación: Clip2Post es una app de IA creativa — el usuario no quiere "aprender la herramienta", quiere ver el resultado ya. Cobrar antes de mostrar un resultado mata la conversión en este nicho (igual que hace OpusClip: paywall DESPUÉS del primer resultado).
- Precio: US$12.99/mes | US$89/año (dentro del rango de competencia $15-99, más agresivo para ganar mercado LATAM)
- Trial: 7 días sin tarjeta (aha inmediato: primer resultado en <2 min, no necesita trial largo)
- Unit economics (gate 40): costo de IA por generación (transcripción + LLM para 3 piezas de texto) estimado muy por debajo del techo de 20% del precio (~US$2.60) — gate pasado en venta directa; revisar de nuevo con datos reales de uso en Sesión 6.

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: Landing ✅ · Onboarding ✅ · Paywall ✅ · Login ✅ · App interna ✅ — falta Servicios externos (Sesión 6)
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- App interna: `app.html` — 3 secciones (Inicio/Piezas/Cuenta) con tab bar, modal de nuevo video con validación real + estado de generación cancelable, filtro combinado por red y por video en Piezas, estados vacío/error diseñados (pendientes de activar con datos reales), loop de retención documentado abajo

## Loop de retención (Regla de Oro #6 — activo, documentado en Sesión 5)
- Gatillo: abre la app para ver su semana / recuerda que tiene un video sin convertir
- Acción: toca "Convertir un nuevo video" (1 tap) → pega link o sube archivo
- Recompensa: ve sus 3 piezas listas en <3s (simulado) + celebración con el conteo actualizado
- Inversión: el video queda en su biblioteca (Piezas), el contador semanal crece (horas ahorradas acumuladas) — "si borro tu historial, la app de mañana es idéntica" = NO, el dato de "esta semana" y el insight en voz del mecanismo cambian con cada video nuevo
- M0 (ritual diario, pantalla Inicio): dato de la semana → CTA de 1 tap → estado de racha → insight en voz de "El Multiplicador de Voz" (blueprint de 56)
- Primera semana D1-D7: pendiente de diseñar en detalle en Sesión 6 junto con notificaciones (requiere backend real)

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js (App Router) — default del stack pineado del SO (51), necesario por SEO de la landing de venta.
- Base de datos/Auth: Supabase (Postgres + RLS + Auth con email/Google).
- Stack de IA: transcripción voz→texto (Whisper/AssemblyAI) + LLM (Claude) para generar los 3 formatos de texto — procesamiento ASÍNCRONO (el video tarda en transcribirse; se muestra estado "generando..." con progreso, nunca un spinner ciego). Corre por servidor/BFF, nunca la clave en el cliente.
- Qué NUNCA debe hacer la app: nunca publicar/auto-postear en redes sin permiso explícito del usuario · nunca inventar datos o citas que no estén en el video original · nunca compartir el contenido o transcripción del usuario con terceros · nunca presionar con culpa para retener (sin dark patterns de cancelación).

## Sesiones completadas ✅
- Sesión 1 — Validación, FICHA-MODELO.md (OpusClip), Constitución, monetización y stack — 2026-09-22
- Sesión 2 — Identidad visual: dirección A "Estudio Confiable" (naranja sobre carbón-marrón) aprobada, FICHA-ARTE.md cerrada — 2026-09-22
- Sesión 3 — Página de ventas: FICHA-AVATAR.md, mecanismo "El Multiplicador de Voz" bautizado, landing.html con 10 secciones + elementos visuales, revisor-visual LISTA (36/40·18/20·19/20) — 2026-09-22
- Sesión 4 — Onboarding (4 pasos), paywall (narrativa de 7 preguntas) y login (passwordless) construidos, los 3 verificados LISTA por revisor-visual — 2026-09-22
- Sesión 5 — App interna (Inicio/Piezas/Cuenta), loop de retención documentado, revisor-visual LISTA (36/40·18/20) tras 7 rondas de pulido — 2026-09-22

## Sesión en progreso 🔧
(ninguna — Sesión 5 cerrada, pendiente aprobación del usuario para arrancar Sesión 6)

## Próximas sesiones 📋
- Sesión 6: Integraciones reales y seguridad (Supabase, IA real, Hotmart, dominio)
- Sesión 7: Testing, animaciones, pulido y rigor de entrega

## Problemas conocidos ⚠️
- [direcciones-abc / landing] Sección 5 de la landing ("La app por dentro") usa un mini-demo HTML honesto del mecanismo, no screenshots reales — pendiente reemplazar por capturas reales de la app (ya construida en app.html) cuando haya backend en Sesión 6
- [docs/copy] Footer legal de landing.html tiene enlaces placeholder a Términos/Privacidad/Contacto — el contenido real de esas páginas se redacta con 47-LEGAL-FISCAL-Y-PRIVACIDAD.md, pendiente
- [app] Los estados vacío (`#emptyVideos`) y de error (`#errorVideo`) de app.html están diseñados y estilizados pero no wireados a condiciones reales (siguen con clase `.hidden`) — se activan con datos reales de Supabase en Sesión 6
- [app] "Tono de las piezas" y "Facturación y plan" en Cuenta muestran un toast "se conecta en la Sesión 6" — son placeholders honestos, no funciones rotas

## Pendientes del usuario (acciones que el usuario debe hacer)
(ninguno todavía — se le avisará cuando lleguemos a cuentas/servicios externos)

## Notas para la próxima sesión
- El documento fuente completo está en D:\Desktop\CHAT GPT\CLIP2POST.docx — incluye mapa de empatía completo (10 dolores, 10 deseos, lenguaje literal del cliente).
- Nombre definitivo: Clip2Post (confirmado por el usuario).
- Moneda: todos los precios del proyecto van en USD ($12.99/mes · $89.00/año · $7.42/mes mostrado) — confirmado explícitamente por el usuario, no cambiar a moneda local sin pedirlo él.
- Prototipo estático (sin backend aún): landing.html → onboarding.html → paywall.html → login.html están enlazados entre sí y usan un video de ejemplo consistente ("Cómo cerrar clientes B2B") — la conexión real de datos entre pantallas llega en Sesión 6 con Supabase.
