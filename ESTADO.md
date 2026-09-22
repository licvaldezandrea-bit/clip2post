# ESTADO — Clip2Post
Última actualización: 2026-09-22 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: FICHA-MODELO.md creada (app modelo: OpusClip, 2 señales de revenue verificadas) / Siguiente acción exacta: Esperando respuesta del usuario sobre el nombre de la app (Clip2Post / ContentFlip / RepurposeAI / otro), luego continuar Constitución del Producto (B3).

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

## Estrategia de monetización (propuesta, a confirmar)
- Modelo: por decidir en B3 (Hard paywall vs Onboarding-first — matriz 02C)
- Precio propuesto: US$12.99/mes | US$89/año — a validar contra gate de unit economics (40)
- Trial: 7 días o 2 créditos de proyecto, sin tarjeta (según investigación previa)

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: Constitución del producto en curso (B3)
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: por decidir (Sesión 1, regla del stack en 51-STACK-PINEADO.md)
- Stack de IA: requiere transcripción voz→texto + LLM para generación de copy — decisión sync/async en Sesión 1 (30-INTEGRACION-IA.md)

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
