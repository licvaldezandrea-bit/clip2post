# ESTADO — Clip2Post
Última actualización: 2026-10-08 | Sesión actual: 6

⏸️ CHECKPOINT — Última acción completada: AUDITORÍA 10/10 en curso. Capa 1 (seguridad/backend) y Capa 2 (pantallas al motor real, legales, consentimiento, eliminar cuenta) construidas y verificadas (tsc, eslint, 29 tests, build limpios; 0 vulnerabilidades). FALTA APLICAR la migración 0002 en Supabase (SQL Editor) y configurar Supabase Auth (URL, plantillas de correo) — hasta entonces login/generación reales no funcionan en producción. Siguiente acción exacta: usuario aplica 0002 + config de Auth; luego prueba E2E con usuario de prueba (RLS, cupos, login por código, subida, generación) y cierre de la auditoría.

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
- Framework: Next.js (App Router) — default del stack pineado del SO (51), necesario por SEO de la landing de venta. Scaffold real ya creado en la raíz del proyecto (`app/`, `lib/`, `proxy.ts`, `package.json`) — convive con las 5 pantallas HTML (siguen siendo la referencia visual hasta que se porten a React).
- Base de datos/Auth: Supabase (Postgres + RLS + Auth con email/Google). Esquema real escrito en `supabase/migrations/0001_esquema_inicial.sql`: `profiles` (plan/trial/tono/racha, se crea sola al registrarse), `videos`, `piezas` (1 por red y por video), `media_jobs` (cola, patrón async de 30), `ai_calls` (gasto real, de ahí lee el kill-switch). Todas con RLS por `(select auth.uid())`.
- Stack de IA: transcripción con **AssemblyAI** (`lib/transcribe.ts`) + generación de las 3 piezas con **Claude Sonnet** vía tool-use forzado + zod (`lib/ai-adapter.ts`, nunca parsea texto libre a ciegas). Resiliencia real: reintentos con backoff, circuit-breaker por proveedor (`lib/circuit-breaker.ts`), tope de gasto diario/mensual antes de cada llamada (`lib/budget.ts`). Todo corre en el servidor (`app/api/generate/route.ts`), la clave nunca llega al navegador.
- ⚠️ Simplificación de esta sesión (documentada, no oculta): el patrón canónico es job 100% asíncrono con worker en background; por ahora el job se procesa DENTRO de la misma llamada a `/api/generate` (más simple, funciona para el volumen inicial) — la tabla `media_jobs` ya quedó modelada para pasar a un worker real sin tocar el esquema, cuando haya más usuarios (ver 13-INFRA-ESCALABILIDAD.md).
- ⚠️ Límite actual de la transcripción: solo funciona con un archivo de audio/video ya subido (o una URL directa a un .mp3/.mp4 público) — pegar un link de YouTube todavía NO transcribe (haría falta un paso extra para bajar el audio del video, no construido en esta sesión).
- Qué NUNCA debe hacer la app: nunca publicar/auto-postear en redes sin permiso explícito del usuario · nunca inventar datos o citas que no estén en el video original (el prompt del generador lo exige explícitamente) · nunca compartir el contenido o transcripción del usuario con terceros · nunca presionar con culpa para retener (sin dark patterns de cancelación).

## Sesiones completadas ✅
- Sesión 1 — Validación, FICHA-MODELO.md (OpusClip), Constitución, monetización y stack — 2026-09-22
- Sesión 2 — Identidad visual: dirección A "Estudio Confiable" (naranja sobre carbón-marrón) aprobada, FICHA-ARTE.md cerrada — 2026-09-22
- Sesión 3 — Página de ventas: FICHA-AVATAR.md, mecanismo "El Multiplicador de Voz" bautizado, landing.html con 10 secciones + elementos visuales, revisor-visual LISTA (36/40·18/20·19/20) — 2026-09-22
- Sesión 4 — Onboarding (4 pasos), paywall (narrativa de 7 preguntas) y login (passwordless) construidos, los 3 verificados LISTA por revisor-visual — 2026-09-22
- Sesión 5 — App interna (Inicio/Piezas/Cuenta), loop de retención documentado, revisor-visual LISTA (36/40·18/20) tras 7 rondas de pulido — 2026-09-22
- Sesión 5 (extensión) — Paywall mejorado con línea de tiempo del trial + CTA fijo + disciplina de color, revisor-visual LISTA (37/40·18/20·19/20) tras 8 rondas — 2026-09-22

## Sesión en progreso 🔧
- Sesión 6 (integraciones reales) — arrancada 2026-09-23. Hecho: scaffold Next.js real + esquema de base de datos con RLS + motor de IA real (transcripción + generación + resiliencia + tope de gasto), todo verificado con `tsc`/`build` limpios. Falta: que el usuario cree sus cuentas (Supabase/Anthropic/AssemblyAI) y pegue las claves en `.env.local`; conectar login.html al login real; conectar app.html/onboarding.html al endpoint `/api/generate` en vez de la simulación con `setTimeout`; Hotmart; dominio.

## Próximas sesiones 📋
- Sesión 7: Testing, animaciones, pulido y rigor de entrega

## Problemas conocidos ⚠️
- [direcciones-abc / landing] Sección 5 de la landing ("La app por dentro") usa un mini-demo HTML honesto del mecanismo, no screenshots reales — pendiente reemplazar por capturas reales de la app (ya construida en app.html) cuando haya backend en Sesión 6
- [docs/copy] Footer legal de landing.html tiene enlaces placeholder a Términos/Privacidad/Contacto — el contenido real de esas páginas se redacta con 47-LEGAL-FISCAL-Y-PRIVACIDAD.md, pendiente
- [app] Los estados vacío (`#emptyVideos`) y de error (`#errorVideo`) de app.html están diseñados y estilizados pero no wireados a condiciones reales (siguen con clase `.hidden`) — se activan con datos reales de Supabase en Sesión 6
- [app] "Tono de las piezas" y "Facturación y plan" en Cuenta muestran un toast "se conecta en la Sesión 6" — son placeholders honestos, no funciones rotas
- [app] La animación de celebración (`assets/celebracion-video-listo.json`, provista por el usuario) pesa ~1.4MB — funciona bien pero conviene comprimirla/recortarla antes de publicar la app para no alargar el primer uso en conexiones lentas de LATAM (ver 38-PERFORMANCE-BUDGET.md)

## Pendientes del usuario (acciones que el usuario debe hacer)
- ✅ Supabase, Anthropic, AssemblyAI, GitHub y Vercel: cuentas creadas y conectadas (2026-10-07).
- Ninguna clave se pide ni se pega en el chat — van directo a `.env.local` (que ya está en `.gitignore`, nunca se sube a git).

## Notas para la próxima sesión
- El documento fuente completo está en D:\Desktop\CHAT GPT\CLIP2POST.docx — incluye mapa de empatía completo (10 dolores, 10 deseos, lenguaje literal del cliente).
- Nombre definitivo: Clip2Post (confirmado por el usuario).
- Moneda: todos los precios del proyecto van en USD ($12.99/mes · $89.00/año · $7.42/mes mostrado) — confirmado explícitamente por el usuario, no cambiar a moneda local sin pedirlo él.
- Prototipo estático (sin backend aún): landing.html → onboarding.html → paywall.html → login.html están enlazados entre sí y usan un video de ejemplo consistente ("Cómo cerrar clientes B2B") — la conexión real de datos entre pantallas llega en Sesión 6 con Supabase.

## Notas de operación (2026-10-07)
- Proyecto Supabase de Clip2Post: `munpaeapqpqlyiegguok` (org licvaldezandrea-bit). El conector de Supabase de la sesión ve OTRA cuenta/proyecto (`ecoaustral`) — NO tocarlo desde esta sesión; las migraciones de Clip2Post se aplican pegando el SQL en el SQL Editor del dashboard.
- Plan gratuito de Supabase pausa el proyecto tras ~1 semana sin actividad (pasó una vez y se reanudó con "Resume"). Antes de vender: pasar a plan que no se pause. Vercel Hobby es no comercial: pasar a Pro antes de cobrar.
- Claves: se guardan con `scripts/GUARDAR-CLAVE-*.bat` (doble clic, pegado oculto). Si una clave aparece en chat/captura/log → rotarla (ocurrió con Anthropic y AssemblyAI en pruebas; ya rotadas). Revisar que las claves viejas de Anthropic/AssemblyAI y las "Legacy API keys" de Supabase estén eliminadas/deshabilitadas.
- Pendiente de saldo: la cuenta de Anthropic tenía 0 US$ — hay que cargar fondos para que la generación real funcione.
- Producción (Vercel): https://clip2post-one.vercel.app — responde 200, variables de entorno cargadas (3 secretas con candado), `/api/generate` sin sesión devuelve 401 "No autenticado" (correcto). Ojo: `clip2post.vercel.app` es de un tercero, NO es nuestro. La home todavía es la plantilla por defecto de Next: las 5 pantallas HTML siguen fuera del proyecto real y hay que portarlas.

## Auditoría 10/10 — decisiones y estado (2026-10-08)
- Las 5 pantallas siguen siendo HTML estático servido por Next desde `public/` (rewrites en `next.config.ts`: `/`→landing, `/app`, `/login`, `/paywall`, `/onboarding`, `/terminos`, `/privacidad`). Decisión: no portarlas a React (40+ rondas de revisión de diseño; el HTML conserva fidelidad pixel). El JS de cada pantalla llama a las rutas `/api/*`.
- Seguridad de datos: migración `0002_seguridad_cupos_pagos.sql` — el navegador solo lee lo suyo y cambia `tono`; plan/trial/videos/piezas/jobs/gasto los escribe solo el servidor. `reserve_generation` (SQL, service_role) decide plan + cupo (trial 3 videos; pago 60/mes) + presupuesto global (lock) + idempotencia por usuario en un solo paso atómico. Fallos no cuentan en el cupo.
- Auth: login por código de 6 dígitos o link, 100% del lado del servidor (`/api/auth/send|verify|logout`, `/auth/callback`), cookies httpOnly; `proxy.ts` protege `/app`. Google OAuth NO está activo (se quitó el botón). Consentimiento (Términos+Privacidad) con casilla sin premarcar y registrado con versión (`lib/legal.ts`).
- Pagos: `/api/webhooks/hotmart` (hottok constante, idempotente por id de evento, crea usuario si compra antes de registrarse). Mapeo plan anual por `HOTMART_ANNUAL_OFFER_CODES`. Links de checkout en `public/checkout-config.js` (VACÍOS hasta crear el producto en Hotmart).
- Legal: `terminos.html` y `privacidad.html` redactados; datos del responsable en `public/legal-datos.js` (titular/país/contacto VACÍOS — completar antes de lanzar).
- IA: transcripción AssemblyAI (costo incluido en el tope de gasto), Claude con anti-inyección y tope de entrada; subida directa a Storage privado (50 MB, se borra tras transcribir). Links de YouTube/redes NO soportados (mensaje claro).
- Legal: titular Andrea Valdez, Argentina, contacto andreamariavaldez.81@gmail.com (provisorio; cambiar a soporte@dominio cuando exista). Aplicadas: 0002 ✅, Site URL + Redirect URL ✅. Pendientes del usuario: (2) plantillas de correo con `{{ .Token }}` (solo editable con SMTP propio), (3) SMTP propio (Resend + dominio) — el correo por defecto de Supabase tiene límite muy bajo, (4) cargar saldo en Anthropic, (5) crear producto en Hotmart → HOTTOK en Vercel + links en checkout-config.js, (6) datos del responsable legal, (7) planes de pago de Vercel/Supabase antes de vender.
- Evidencia de verificación (2026-10-08): prueba E2E contra el Supabase real, 24/24 OK (9 ataques bloqueados: auto-upgrade de plan, extender trial, falsificar jobs/videos/piezas, leer gasto/pagos, llamar reserve_generation; + doble clic, en_curso, cupo trial, presupuesto, plan vencido/cancelado). Subida real a Storage + transcripción AssemblyAI con audio mudo → SIN_VOZ manejado (video en error sin gastar cupo, costo registrado, archivo borrado). Sitio en producción: rutas OK, /app redirige a login sin sesión, APIs 401, CSP+cabeceras activas, webhook cerrado (503) hasta configurar HOTTOK. 32 tests, tsc, eslint y build limpios; npm audit 0.
- Nota técnica: Supabase genera códigos de **8 dígitos** por defecto; la UI del código usa 6 casillas → al activar `C2P_AUTH.codigoPorCorreo` hay que fijar "Email OTP length = 6" en Supabase Auth (o adaptar la UI). Mientras tanto el login es por link (mismo navegador, PKCE).
- Pendiente de re-revisión con `revisor-visual` tras estos cambios: app.html (datos reales) y onboarding.html (paso 2 → ejemplo). Los cambios son de datos/copy, no de diseño; no se re-puntuaron.
- NO verificado aún: la generación con Claude (la cuenta de Anthropic tiene saldo 0) y el login real por correo (Supabase por defecto solo envía a miembros del equipo y con límite muy bajo; hace falta SMTP propio → dominio + Resend).
