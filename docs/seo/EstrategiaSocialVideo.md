# Estrategia Social Video — MiniGol Club

> Documento vivo. Revisar mensualmente con datos reales de alcance e impresiones.
> Decisiones tomadas con el usuario en sesión del 2026-04-28.
>
> **Update 2026-05-13:** la sección §7 ("Stack técnico") proponía Publer como capa de publicación. Tras pruebas reales con Publer (500s persistentes y coste no justificado), se canceló esa cuenta y se migró a **Instagram Graph API directa** (Meta). Detalles en [SchedulerInstagram.md](../SchedulerInstagram.md). El resto del documento (estrategia editorial, formatos, hashtags) sigue vigente.

---

## 1. Objetivo

Generar tráfico de descubrimiento hacia `minigolclub.com` desde Instagram Reels como canal complementario al SEO orgánico de Google. El SEO tarda 3-6 meses en escalar; los Reels pueden atraer tráfico desde la semana 1 en el perfil de audiencia (padres 30-45, móvil-first, scrollean Reels mientras sus hijos entrenan).

---

## 2. Decisiones cerradas (no abrir de nuevo sin datos)

| Decisión | Elección | Razón |
|----------|----------|-------|
| Plataforma | **Instagram Reels** únicamente | Evitar sobrecarga inicial; TikTok y YouTube Shorts se evalúan al mes 3 con datos reales |
| Producción | **In-house + freelance** | Máximo control de marca en inicio; escalar con freelance cuando el volumen supere 3 vídeos/semana |
| Cuenta | **@minigolclub** ✅ creada (2026-04-28) | Separar identidad de marca de cuentas personales desde el día 1 |

---

## 3. Formato base

- **Duración:** 15-30 segundos (máx 60 si la guía lo requiere)
- **Ratio:** vertical 9:16, 1080×1920 px
- **Sin caras de menores ni de padres reales** — usar ilustraciones, diagramas tácticos de la Pizarra, manos + balón, animaciones
- **Voz:** voiceover IA (ElevenLabs español neutro peninsular) o voz propia sin mostrar cara
- **Subtítulos:** siempre quemados en vídeo (85% de visualizaciones sin sonido en Reels)
- **Música:** librería libre de royalties (no usar canciones populares para evitar copyright strike)

---

## 4. Estructura de cada vídeo (3 actos)

```
[0-3s]   HOOK   — pregunta o dato impactante ("¿Tu hijo no quiere conducir el balón?")
[3-25s]  CARNE  — 3-5 pasos visuales del ejercicio / tip / guía
[25-30s] CTA    — "Guía completa en minigolclub.com" + URL en el bio o link sticker
```

Cada vídeo apunta a **un artículo concreto del sitio**, nunca a la home. El artículo debe estar publicado ANTES de subir el vídeo.

---

## 5. Cadencia objetivo

| Fase | Período | Vídeos/semana | Objetivo |
|------|---------|---------------|---------|
| Arranque | Mes 1 | 3 | Probar formatos, detectar qué gancha |
| Crecimiento | Mes 2-3 | 5 | Entrar en el algoritmo de exploración |
| Escala | Mes 4+ | 7 | Canal aportando ≥20% del tráfico total |

3 vídeos/semana es el mínimo recomendado para que el algoritmo de Reels distribuya más allá de los seguidores actuales.

---

## 6. Artículos semilla (primeros vídeos)

Estos artículos ya están publicados y son las mejores semillas por topic clarity y volumen de búsqueda:

1. `ejercicios-futbol-ninos-en-casa` → "5 ejercicios en casa sin material"
2. `conduccion-balon-futbol-ninos` → "Slalom paso a paso: de 0 a dominar el balón"
3. `calendario-mundial-2026-ninos` → "Mundial 2026 en 30s para explicárselo a tu hijo"
4. `dinamicas-grupo-entrenamientos-futbol-infantil` → "3 dinámicas que funcionan con cualquier grupo"
5. `ejercicios-coordinacion-futbol-ninos` → "Coordinación con conos: 3 niveles"

---

## 7. Herramientas

| Herramienta | Uso | Coste |
|-------------|-----|-------|
| CapCut (móvil o desktop) | Edición principal, subtítulos automáticos | Gratis |
| ffmpeg | Batch de clips, resize, overlay SVG | Gratis |
| Pizarra Táctica (interna) | Presets tácticos para diagramas visuales | Gratis (ya en roadmap) |
| ElevenLabs | Voiceover IA en español neutro | $5/mes plan Starter |
| Canva (opcional) | Portadas / thumbnails de Stories | Gratis |

---

## 8. Tracking y analytics

Cada enlace en bio o link sticker usa UTM:

```
https://minigolclub.com/<categoria>/<slug>/?utm_source=instagram&utm_medium=reel&utm_campaign=<slug>
```

Seguimiento en GA4: crear segmento de audiencia `utm_source=instagram` para ver sesiones, scroll depth y conversiones (clics Amazon, descarga PDF si existe).

Si se activa Instagram Pixel en el futuro: declararlo en `docs/GuiaMonetizacion.md` y añadir categoría de consentimiento en el CookieBanner.

---

## 9. Integración con la Pizarra Táctica

La Pizarra ya genera presets visuales de ejercicios (ADR en `docs/ArquitecturaPizarra.md`). Punto de integración natural:

1. Usuario crea un preset en la Pizarra
2. Exporta como imagen/GIF
3. Monta el Reel con ese visual + voiceover
4. CTA apunta al artículo asociado

Esto convierte la Pizarra en motor de creatividades para Reels sin coste adicional de producción.

---

## 10. Métricas de seguimiento (actualizar mensual)

| Métrica | Objetivo mes 3 | Actual | Última medición |
|---------|----------------|--------|-----------------|
| Seguidores @minigolclub | 500 | 0 | — |
| Alcance medio por Reel | 2.000 | — | — |
| Sesiones GA4 desde Instagram | 300/mes | 0 | — |
| CTR Reel → artículo | >2% | — | — |
| Artículos con vídeo asociado | 5 | 0 | — |

---

## 11. Pendientes antes de publicar el primer Reel

- [x] Crear cuenta @minigolclub en Instagram con bio + link minigolclub.com (2026-04-28)
- [ ] Configurar cuenta como Creador (no Empresa — mejor alcance orgánico en Reels)
- [ ] Producir 3 Reels piloto de los artículos semilla §6
- [ ] Verificar que los artículos destino tienen UTM configurado y GA4 recibe las sesiones

---

## 12. Sistema de scheduling y publicación (roadmap)

> **Decisión 2026-04-29:** análisis del repo `victorialozano0/LOVEYOURSELFJOURNAL` extrae aprendizajes
> aplicables. Adoptamos un enfoque por fases — no construir infraestructura antes de validar producto-mercado.

### Fase 0 — Manual (HOY → primeros 3-5 Reels)
**Objetivo:** validar ángulo editorial, formato y respuesta de la audiencia antes de invertir en herramientas.

- Producir vídeos en Reels nativo o CapCut
- Publicar manualmente desde la app de Instagram
- Trackear métricas en hoja de cálculo simple (alcance, guardados, link clicks)
- **Coste:** 0€
- **Cuándo pasar a Fase 1:** cuando se publique 1 Reel/semana de forma consistente durante 4 semanas

### Fase 1 — Calendario versionado en Git + recordatorios (cuando estable)
**Objetivo:** auditabilidad editorial + reducir fricción de "qué publico hoy".

**Stack propuesto:**
- `content/social/calendar.json` — array versionable con cada post: `{id, platform, scheduled_at, status, hook, caption, hashtags, asset_path, target_url, utm_campaign}`
- `status: draft | approved | published | archived` — el flujo es PR review → merge a `main` = aprobado
- Cloudflare Worker con Cron Trigger (estilo `bts-trending` de LYJ) que lee `calendar.json` desde GitHub raw, filtra `scheduled_at <= now AND status=approved`, y **NO publica** sino que envía email/Discord al editor con "publica esto ahora" + asset adjunto
- Render de imagen social (cover Pinterest, OG card) generado en CI con Satori/Resvg desde el frontmatter del artículo asociado
- **Coste:** 0€ (Cloudflare Workers free tier + email Brevo free)
- **Cuándo pasar a Fase 2:** cuando se publique 3+ posts/semana en 2+ plataformas

### Fase 2 — Publisher API real (cuando volumen lo justifique)
**Objetivo:** automatizar la publicación cross-platform sin intervención.

**Opciones:**
1. **Publer** (~15€/mes) — soporta IG/TikTok/X/LinkedIn/Pinterest, evita la aprobación oficial Meta/TikTok que tarda semanas. Vendor lock-in pero ROI alto si publicamos 3+/semana.
2. **Buffer** (~6€/mes una cuenta) — más barato, menos plataformas
3. **n8n self-hosted** (gratis) — más complejo, requiere mantener servidor

**Recomendación:** Publer cuando se cumpla el umbral. Lo que se construya en Fase 1 (calendar.json + worker scheduler) sigue siendo válido — solo se cambia el destino: del email "publica esto" pasa a `POST publer.com/api/v1/posts`.

### Lo que NO replicamos del enfoque LYJ
- **App React local con `localStorage`** como source of truth → frágil, no auditable, requiere máquina encendida.
- **OAuth tokens propios para TikTok/Meta** → semanas de aprobación oficial. Si decidimos vídeo masivo, ir directo a Publer.
- **Pipeline Remotion local** → over-engineering para nuestro caso (textos + imagen estática suficiente; los Reels los grabamos manualmente).

### Lo que SÍ replicamos
1. **Cloudflare Worker con Cron Trigger** estilo `bts-trending` — adaptado a "detectar tendencias futbol infantil" (LaLiga, Mundial 2026, fichajes) y notificar al editor con hooks reactivos.
2. **Plan editorial en JSON único versionado** con flujo `status: draft|approved|scheduled|published`.
3. **Distribución horaria por plataforma documentada** — adaptar a horarios España/LATAM padres (mañana 8-9h colegio, tarde 17-18h salida cole, noche 21-22h post-cena).
4. **Aprobación humana antes de publicar** — el `status: approved` se hace vía PR review en Git, más auditable que un toggle en `localStorage`.

### Riesgos identificados
- **Datos de menores:** nuestro nicho es padres adultos. Nunca contenido que recoja datos del menor. Audiencia objetivo en redes = adulto siempre.
- **Rate limits IG Graph API:** ~200 req/h. Suficiente para nuestro volumen previsto.
- **TikTok Direct Post sin aprobación oficial:** publica como `SELF_ONLY` (luego manual a público). No es opción real → si vamos a TikTok será vía Publer.
- **GDPR/RGPD con Publer:** procesa datos en EU/US. Chequear DPA antes de adoptar.
- **Vendor lock-in Publer:** mitigado por mantener `calendar.json` en Git como source of truth — siempre se puede cambiar de publisher.

### Métricas para decidir avance entre fases
- **Fase 0 → Fase 1:** 4 semanas consecutivas con 1 Reel/semana publicado y >500 visualizaciones medias
- **Fase 1 → Fase 2:** 3+ posts/semana en 2+ plataformas durante 4 semanas, o tiempo manual >1h/semana
- [ ] Decidir si usar ElevenLabs o voz propia (probar ambas con un clip piloto)
