# ESTADO — Clip2Post
Última actualización: 2026-09-22 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: Usuario aprobó los 3 mini-acuerdos de negocio (monetización, precio, límites de la app) / Siguiente acción exacta: Presentar Plan Maestro (B5) y esperar aprobación para arrancar Sesión 2 (identidad visual).

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

## Avatar (de la ficha ya investigada — FICHA-AVATAR.md se redacta en breve)
- Nombre: Carlos, 34 años, consultor B2B / creador independiente de alto valor
- Dolor #1: pierde 4-8h/semana adaptando un video a texto para cada red; termina publicando "basura robótica" o no publica
- Deseo #1: pegar un link y tener el post de LinkedIn + hilo de X + carrusel IG listos en 60 segundos, sonando 100% como él
- Nivel de consciencia: 4/5 (consciente de la solución, escéptico de la calidad de la IA)
- Objeción principal: "¿va a sonar a robot?" / "¿ya pago ChatGPT, para qué esto?"
- Ángulo ganador: "Tu trabajo pesado terminó en cuanto diste 'detener' a la grabación."

## MVP — funciones núcleo (de la investigación, a confirmar en B3)
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
- Estado de la secuencia: Constitución del producto en curso (B3)
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js (App Router) — default del stack pineado del SO (51), necesario por SEO de la landing de venta.
- Base de datos/Auth: Supabase (Postgres + RLS + Auth con email/Google).
- Stack de IA: transcripción voz→texto (Whisper/AssemblyAI) + LLM (Claude) para generar los 3 formatos de texto — procesamiento ASÍNCRONO (el video tarda en transcribirse; se muestra estado "generando..." con progreso, nunca un spinner ciego). Corre por servidor/BFF, nunca la clave en el cliente.
- Qué NUNCA debe hacer la app (derivado de la promesa, confirmar con el usuario): nunca publicar/auto-postear en redes sin permiso explícito del usuario · nunca inventar datos o citas que no estén en el video original · nunca compartir el contenido o transcripción del usuario con terceros · nunca presionar con culpa para retener (sin dark patterns de cancelación).

## Sesiones completadas ✅
(ninguna aún)

## Sesión en progreso 🔧
- Sesión 1 — Validación (ya hecha por el usuario) ✅ · FICHA-MODELO.md (OpusClip) ✅ · Constitución del Producto (B3) en curso — esperando nombre de app

## Próximas sesiones 📋
- Sesión 1: Constitución, AVATAR formal, monetización, arquitectura
- Sesión 2: Identidad visual

## Problemas conocidos ⚠️
(ninguno)

## Pendientes del usuario (acciones que el usuario debe hacer)
(ninguno todavía — se le avisará cuando lleguemos a cuentas/servicios externos)

## Notas para la próxima sesión
- El documento fuente completo está en D:\Desktop\CHAT GPT\CLIP2POST.docx — incluye mapa de empatía completo (10 dolores, 10 deseos, lenguaje literal del cliente) útil para el copy de venta en Sesión 3.
- Nombre: el usuario lo llama "Clip2Post" en el docx; el resumen final propone "ContentFlip" como principal. Confirmar nombre definitivo con el usuario.
