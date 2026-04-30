# scripts/social/

Sistema de publicación programada a redes sociales — utilities y generadores.

> **Documentación completa del sistema:** [docs/SchedulerPubler.md](../../docs/SchedulerPubler.md) (introducido en PR #50).
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

Las imágenes se guardan en `public/social/<slug>/<format>.jpg`. Como están bajo `public/`, son servidas directamente y accesibles por raw GitHub para que Publer las descargue al programar el post.

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

## Otros scripts

| Script | Función |
|--------|---------|
| `validate-calendar.mjs` | Valida `content/social/calendar.json` (PR #50) |
| `scheduler.mjs` | Lee calendar, publica via Publer, commitea (PR #50) |
| `publer-client.mjs` | Cliente Publer API mínimo (PR #50) |
| `list-accounts.mjs` | Helper one-shot para descubrir Account IDs (PR #50) |
| `generate-image.mjs` | Generador de imágenes sociales (este PR) |

## Workflow editorial completo

1. Editor decide publicar el artículo `X` en Instagram
2. `pnpm social:image -- --slug=X --format=feed --locale=es` → imagen lista
3. Edita `content/social/calendar.json` añadiendo el post (apunta a `public/social/X/feed.jpg`)
4. PR review + merge a `main` con `status: approved`
5. En el siguiente cron (max 30min), `scheduler.mjs` envía a Publer
