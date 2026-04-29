# Estrategia Social Video — MiniGol Club

> Documento vivo. Revisar mensualmente con datos reales de alcance e impresiones.
> Decisiones tomadas con el usuario en sesión del 2026-04-28.

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

- [ ] Crear cuenta @minigolclub en Instagram con bio + link minigolclub.com
- [ ] Configurar cuenta como Creador (no Empresa — mejor alcance orgánico en Reels)
- [ ] Producir 3 Reels piloto de los artículos semilla §6
- [ ] Verificar que los artículos destino tienen UTM configurado y GA4 recibe las sesiones
- [ ] Decidir si usar ElevenLabs o voz propia (probar ambas con un clip piloto)
