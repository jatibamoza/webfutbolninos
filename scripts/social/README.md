# scripts/social/

Sistema de publicación programada a redes sociales — utilities y generadores.

> **Documentación completa del sistema:** [docs/SchedulerInstagram.md](../../docs/SchedulerInstagram.md).
> Este README se centra en los scripts.

## Generador de imágenes sociales

`generate-image.mjs` — genera imágenes 1080×1080 (feed), 1000×1500 (Pinterest) o 1080×1920 (reel cover) desde el frontmatter de un artículo MDX.

### Uso

```bash
pnpm social:image -- --slug=ejercicios-futbol-6-anos --format=feed --locale=es
pnpm social:image -- --slug=exercicis-futbol-6-anys --format=pinterest --locale=ca
pnpm social:image -- --slug=conduccion-balon-futbol-ninos --format=reel-cover --locale=es
```

### Args

- `--slug=<slug>` — slug del artículo (sin extensión). Busca en `src/content/articulos/<cat>/` o `src/content/articulos-ca/<cat>/` según locale.
- `--format=<format>` — `feed` (1080×1080), `pinterest` (1000×1500) o `reel-cover` (1080×1920). Default: `feed`.
- `--locale=<es|ca>` — colección a buscar. Default: `es`.

### Output

Las imágenes se guardan en `public/social/<slug>/<format>.jpg`. Como están bajo `public/`, son servidas directamente y accesibles por raw GitHub para que Instagram Graph API las descargue al publicar el post.

### Diseño

Tokens "Cuaderno de Campo":
- **Cover original difuminado y oscurecido** como background
- **Marker amarillo lateral izquierdo** (acento de marca, 18px)
- **Top-left:** badge categoría sobre marker amarillo
- **Top-right:** badge edad
- **Bottom:** título grande Fredoka + footer "MiniGol **Club** · minigolclub.com"

### Dependencias

- `satori` — JSX → SVG
- `@resvg/resvg-js` — SVG → PNG
- `sharp` — PNG → JPEG optimizado + difuminado del cover
- `gray-matter` — leer frontmatter MDX

### Fuentes

Requiere TTF estáticos en `src/assets/fonts/`:
- `Fredoka-Bold.ttf`
- `Nunito-Regular.ttf`

Bajadas de fontsource R2 CDN (OFL license, libres para distribuir):
```bash
curl -sL -o src/assets/fonts/Fredoka-Bold.ttf "https://r2.fontsource.org/fonts/fredoka@latest/latin-700-normal.ttf"
curl -sL -o src/assets/fonts/Nunito-Regular.ttf "https://r2.fontsource.org/fonts/nunito@latest/latin-400-normal.ttf"
```

Nota: NO usar las versiones variable de Fredoka — opentype.js (dependencia de Satori) no las parsea.

## Generador batch

`generate-images-batch.mjs` — wrapper en bucle de `generate-image.mjs` con 3 modos:

```bash
# Modo CALENDAR (default): lee calendar.json y genera lo que falta
pnpm social:images:batch

# Modo SLUG: 3 formatos (feed + pinterest + reel-cover) para un slug
pnpm social:images:batch -- --slug=exercicis-futbol-6-anys --locale=ca

# Modo ALL: todos los artículos publicados de la colección, un formato
pnpm social:images:batch -- --all --locale=ca --format=feed

# Flags adicionales
pnpm social:images:batch -- --force        # regenera incluso si existe
pnpm social:images:batch -- --dry-run      # solo loggea, no escribe
```

**Modo CALENDAR** mapea automáticamente `format` del post → formato de imagen:
- `single_image` / `carousel` / `text` → `feed` (1080×1080)
- `reel` / `video` / `story` → `reel-cover` (1080×1920)

Si `media[0].path` del post no coincide con el path canónico (`public/social/<slug>/<format>.jpg`), el batch lo salta y avisa: el editor eligió un asset manual y lo gestiona él.

**Modo ALL** es perfecto para sembrar Pinterest masivamente: una imagen 1000×1500 por cada artículo de la colección, en una sola pasada.

## Otros scripts

| Script | Función |
|--------|---------|
| `validate-calendar.mjs` | Valida `content/social/calendar.json` |
| `scheduler.mjs` | Lee calendar, publica via Instagram Graph API, commitea |
| `instagram-graph-client.mjs` | Cliente Meta Graph API (foto, carrusel, reel) |
| `ig-validate.mjs` | Verifica token + IG Business Account ID antes de mergear |
| `generate-image.mjs` | Generador imagen individual |
| `generate-images-batch.mjs` | Batch (3 modos: calendar, slug, all) |

## Workflow editorial completo

**Caso A — Publicar 1 artículo en 3 plataformas (Instagram + Pinterest + Reel):**
```bash
pnpm social:images:batch -- --slug=X --locale=es     # genera 3 formatos
# Editar calendar.json: 3 posts apuntando a las 3 imágenes con sus paths canónicos
# PR + merge → cron publica los 3 directamente en Instagram
```

**Caso B — Sembrar Pinterest con todos los artículos catalanes:**
```bash
pnpm social:images:batch -- --all --locale=ca --format=pinterest
# Genera 6 imágenes vertical 1000x1500 (una por artículo CA)
# Crear 6 posts en calendar.json escalonados en Pinterest
```

**Caso C — Calendario lleno, generar lo que falte:**
```bash
pnpm social:images:batch     # default modo CALENDAR
# Genera todo lo declarado en calendar.json que no exista todavía
```
