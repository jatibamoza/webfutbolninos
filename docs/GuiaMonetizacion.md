# Guía de Monetización — checklist accionable

> Documento operativo. Pasos exactos para activar AdSense y Amazon Afiliados,
> con qué hace cada uno en código y qué tienes que hacer tú en consola.

---

## 1. Google AdSense

### Estado actual
- ✅ Componente `<AdSlot>` listo en [`src/components/AdSlot.astro`](../src/components/AdSlot.astro). Renderiza placeholder dashed con label "Publicidad" hasta que se active AdSense; cuando se active, inyecta `<ins class="adsbygoogle">` automáticamente.
- ✅ Variable `ADSENSE_CLIENT` lee `import.meta.env.PUBLIC_ADSENSE_CLIENT` desde [`src/consts.ts`](../src/consts.ts).
- ✅ Política de privacidad publicada en `/politica-privacidad/` (requisito AdSense).
- ✅ Política de cookies publicada en `/politica-cookies/` (requisito AdSense).
- ✅ Aviso legal publicado en `/aviso-legal/` (requisito AdSense).
- ✅ Página de contacto publicada en `/contacto/` (requisito AdSense).
- ✅ Banner de cookies con Consent Mode v2 (requisito AdSense en EU).
- ✅ 10 artículos originales publicados (mínimo recomendado por Google).
- ✅ Página `/sobre/` con bio E-E-A-T y transparencia editorial.

### Pasos para solicitar AdSense

1. Entrar en <https://www.google.com/adsense/> con la misma cuenta de Google que usas para Search Console y GA4 (`javier.tibamoza.cubillos@gmail.com`).
2. **"Empezar"** → introducir dominio: `minigolclub.com`.
3. **País / territorio:** España.
4. **Términos y condiciones:** aceptar.
5. **Verificación de tu sitio:** AdSense te pide insertar un `<script>` en el `<head>`. Te darán algo como:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
6. **Aquí entras a tu repo:**
   - Copia el `client` (eso es `ca-pub-XXXXXXXXXXXXXXXX`).
   - Ve al dashboard de **Cloudflare Workers → minigolclub → Settings → Variables and Secrets → Build variables**.
   - Añade variable: `PUBLIC_ADSENSE_CLIENT` con valor `ca-pub-XXXXXXXXXXXXXXXX`.
   - Trigger un nuevo deploy (push cualquier commit, o redeploy manual).
   - Tras el redeploy, el `<AdSlot>` con `slot` definido empezará a inyectar el script automáticamente — **NO hace falta tocar `<head>`** porque el script lo carga el componente cuando hay slot real.
7. **Antes del paso 6**, lo más rápido es pegar temporalmente el script de verificación en `src/layouts/BaseLayout.astro` (en el `<head>`), pushear, esperar a que verifique y luego revertir. Si prefieres, puedes hacerlo así.
8. **Esperar revisión:** AdSense tarda entre 1 día y 2 semanas. Si rechaza:
   - "Contenido insuficiente" → publicar 5 artículos más antes de reaplicar.
   - "Política de privacidad insuficiente" → revisar `/politica-privacidad/` y añadir lo que pidan.
   - "Sitio aún en construcción" → asegurar que TODAS las páginas del menú tienen contenido (no 404, no "próximamente").

### Cuando AdSense apruebe

1. Crear las **unidades de publicidad** en el dashboard AdSense:
   - "Display ad" → para `home-feed`, `cat-top`, etc.
   - "In-article ad" → para slots dentro de artículos.
2. Cada unidad te da un `data-ad-slot` (un número de 10 dígitos).
3. Estos slots se pasan al componente:
   ```astro
   <AdSlot id="home-hero" format="horizontal" slot="1234567890" />
   ```
4. **Auto Ads:** evitarlo en una primera fase. La política `docs/Arquitectura.md §9` define máximo 3 ads por página y posiciones concretas.

### Posiciones planeadas (de `Arquitectura.md §9`)

| Página | Slot |
|---|---|
| Home | `home-hero` (después del hero), `home-feed` (entre secciones) |
| Categoría | `cat-top` (header bottom), in-feed cada 6 artículos (ya implementado en `CategoryLayout`) |
| Artículo | `in-article-top` (post-intro), `in-article-mid` (post H2 #2), `in-article-bottom` (antes de related) |

---

## 2. Amazon Afiliados España

### Estado actual
- ⚠️ Aún no hay componente `<AmazonCard>` ni `<AffiliateDisclosure>` específico — los enlaces de afiliados se mencionan en línea en el copy de los artículos `tieneAfiliados:true`.
- ✅ Aviso legal y política de privacidad mencionan participación en Amazon EU.
- ✅ Artículos con `tieneAfiliados:true` muestran un disclosure dashed paper al inicio (implementado en `ArticleLayout.astro`).
- ✅ Footer con disclosure permanente: "Este sitio participa en el programa de afiliados de Amazon EU…".

### Pasos para solicitar Amazon Afiliados

1. Entrar en <https://afiliados.amazon.es> y hacer login con tu cuenta de Amazon.
2. **Crear cuenta de afiliado** (Programa de Asociados). Datos:
   - **Nombre del sitio:** MiniGol Club
   - **Dirección del sitio:** https://minigolclub.com
   - **Tipo:** Blog / sitio de contenido
   - **Tema principal:** Deportes / Fútbol infantil
   - **Audiencia:** Padres y madres de niños 4-12 años
   - **Cómo dirige tráfico:** SEO orgánico desde Google.
   - **Política de privacidad:** sí (URL: `/politica-privacidad/`).
   - **Visitantes/mes:** rango más bajo (estamos arrancando).
3. **Verificación por SMS** o **número de teléfono**.
4. **Tag de afiliado:** Amazon te asigna uno (algo como `minigolclub-21`). Anótalo.
5. **Aprobación inicial:** suele ser inmediata o tardar 1-2 días.
6. **Período de prueba:** Amazon revisa después de 180 días o las primeras 3 ventas. **Si no haces 3 ventas en 180 días, cierran la cuenta.** No es un problema serio — vuelves a aplicar cuando tengas más tráfico.

### Configurar el tag en el código

Cuando tengas el tag (por ejemplo `minigolclub-21`):

1. Añade variable en Cloudflare Workers Build variables: `PUBLIC_AMAZON_TAG=minigolclub-21`.
2. Añade en `src/consts.ts`:
   ```ts
   export const AMAZON_TAG = import.meta.env.PUBLIC_AMAZON_TAG ?? '';
   ```
3. Cuando crees el componente `<AmazonCard>` (próximo sprint), usa el tag para construir las URLs:
   ```ts
   const url = `https://www.amazon.es/dp/${asin}?tag=${AMAZON_TAG}`;
   ```

### Buenas prácticas Amazon

- **Disclaimer obligatorio** al inicio de cada artículo con afiliados (ya está implementado en `ArticleLayout.astro` cuando `tieneAfiliados:true`).
- **Nunca decir "el más barato"** — Amazon prohíbe declaraciones de precio (cambian). Decir "buena relación calidad/precio".
- **Imágenes de productos:** usar la API de Product Advertising o pedirlas via OneLink. No hacer hotlinking de imágenes de Amazon.
- **No mostrar reseñas falsas** — usar copy propio o reseñas reales de tu hijo/familia.

---

## 3. Roadmap de monetización post-aprobación

| Fase | Cuándo | Acción |
|---|---|---|
| 0 | Hoy | Aplicar a AdSense + Amazon Afiliados España |
| 1 | Tras aprobación AdSense | Activar primer slot en home + 1 in-article. Medir CTR. |
| 2 | +1 mes con datos | Crear componente `<AmazonCard>` + `<ComparisonTable>` con productos reales. |
| 3 | +3 meses | A/B test posiciones de ad. Newsletter conectada a proveedor real (ConvertKit/MailerLite). |
| 4 | +6 meses | Primer recurso PDF descargable (lead-magnet). |
| 5 | Año 1 | Evaluar AdSense Auto Ads + diversificación (Mediavine si llegamos a 50k visitas/mes). |

---

## Recordatorio de líneas rojas

- ❌ **Nunca** datos personales de menores (newsletter solo declara mayoría de edad).
- ❌ **Nunca** ads autoplay con sonido.
- ❌ **Nunca** popups intersticiales.
- ❌ **Nunca** ads sobre el H1 del artículo.
- ❌ **Máximo 3 ads visibles** en cualquier momento.
- ❌ **Nunca** click-bait ("este truco te sorprenderá") — penaliza AdSense y Google a la vez.
