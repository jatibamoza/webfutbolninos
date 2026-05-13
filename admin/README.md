# MiniGol Club Admin — Content Manager

Panel de administración para editar artículos MDX y visualizar el calendar social del sitio MiniGol Club.

## Módulos

- **Artículos** (`/`) — lista, edición, creación con wizard, publicar (auto-PR draft)
- **Crear nuevo** (`/nuevo`) — wizard 4 pasos
- **Social Calendar** (`/social`) — vista del calendar editorial (`content/social/calendar.json`) con preview Instagram

## Quick start

```bash
cd admin
pnpm install
pnpm dev
# → http://localhost:4322
```

## Decisiones técnicas

### Validación Zod en el admin

El schema `articulosCollection` de `src/content.config.ts` usa `image()` de Astro, que es un helper que no existe fuera del contexto de Astro. Por eso **no se importa directamente** desde admin. En su lugar, `admin/src/services/schemaValidator.js` replica los campos del schema con Zod puro (sin `image()`), tratando `cover` como `z.string()` (la ruta relativa tal como está en el frontmatter del MDX).

### Endpoints API (Vite middleware)

Los endpoints corren como middleware de Vite en desarrollo. En producción (build estático) no existen — el admin está pensado solo para entorno local.

- `GET /api/articulos` → lista de todos los `.mdx` parseados
- `GET /api/articulos/:slug` → `{ frontmatter, body, categoria }`
- `PUT /api/articulos/:slug` → escribe el archivo al filesystem (gray-matter stringify)
- `POST /api/articulos/crear` · `/cover` · `/pr` · `:slug/publicar` — wizard + auto-PR draft
- `DELETE /api/articulos/:slug` → borra .mdx + cover
- `GET /api/social/calendar` → lee `content/social/calendar.json`, devuelve posts enriquecidos con `assetReady`/`isOverdue` + counts pre-calculados
- `GET /assets/social/<rest>` → sirve archivos de `public/social/<rest>` para que el preview Instagram pueda mostrar las imágenes generadas

### gray-matter para serialización

`matter.stringify(body, frontmatter)` reconstruye el YAML frontmatter + cuerpo MDX. El orden de claves YAML puede variar respecto al archivo original, pero el contenido es semánticamente idéntico.

### Puerto 4322

Separado del sitio Astro (4321) para poder correr ambos en paralelo.

## Estructura

```
src/
├── context/ToastContext.jsx   — provider que registra el toast handler global
├── services/
│   ├── toast.js               — bridge: toast() global usable sin context
│   └── articulosAPI.js        — fetch wrapper a /api/articulos*
│   └── schemaValidator.js     — schema Zod replicado (sin image() de Astro)
├── hooks/
│   ├── useArticulos.js        — load list / load single / save
│   └── useSocialCalendar.js   — load calendar.json + refetch
├── components/
│   ├── Layout.jsx             — sidebar nav + drawer móvil
│   ├── Logo.jsx               — escudo SVG inline
│   ├── FrontmatterForm.jsx    — form secciones 01-05
│   ├── MDXEditor.jsx          — textarea + tabs Editar/Preview/Raw
│   ├── ValidationFooter.jsx   — footer sticky + validaciones
│   └── social/
│       └── InstagramPreview.jsx — mockup IG fiel para previsualizar posts
└── pages/
    ├── DashboardPage.jsx      — tabla artículos + filtros + search
    ├── EditPage.jsx           — layout 2 columnas
    ├── NuevoArticuloPage.jsx  — wizard 4 pasos
    └── SocialCalendarPage.jsx — timeline calendar social + IG preview
```
