## Contexto

<!-- 1-3 frases: qué se cambió y por qué -->

Cierra #<!-- número de issue -->

## Tipo de cambio

- [ ] `feat` — nueva funcionalidad
- [ ] `fix` — corrección de bug
- [ ] `content` — nuevo artículo o actualización de contenido
- [ ] `seo` — mejora técnica SEO
- [ ] `infra` — CI, deploy, configuración
- [ ] `docs` — documentación
- [ ] `chore` — mantenimiento, dependencias, refactor

## Cómo verificar

<!-- Pasos para probar que esto funciona -->
1. 
2. 

## Checklist técnico

- [ ] `pnpm typecheck` pasa sin errores
- [ ] `pnpm lint` pasa sin errores
- [ ] `pnpm build` genera `dist/` sin warnings
- [ ] No hay `any` en TypeScript nuevo
- [ ] No hay `console.log` dejados atrás

## Checklist de contenido (solo si `content` o `seo`)

- [ ] Frontmatter completo (title ≤70 chars, description 120-160, edadMin/Max, categoría, autor, cover, coverAlt, keyword)
- [ ] H1 único = título del artículo
- [ ] Long-tail keyword en: title, H1, primer párrafo, slug, alt del cover
- [ ] Mínimo 2 internal links a otros artículos del sitio
- [ ] `<Image />` de Astro con width/height en todas las imágenes (CLS = 0)
- [ ] `<AffiliateDisclosure />` presente si hay links de Amazon

## Checklist UI/UX (solo si hay cambios visuales)

- [ ] Touch targets ≥ 44px en mobile
- [ ] Contraste ≥ 4.5:1 (light y dark)
- [ ] Focus visible (ring 3px) en elementos interactivos
- [ ] No emoji como icono estructural (usar Lucide via `astro-icon`)
- [ ] `prefers-reduced-motion` respetado si hay animaciones

## Screenshots (si hay cambios visuales)

<!-- Antes / Después -->
