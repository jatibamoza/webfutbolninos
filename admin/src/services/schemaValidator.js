// Schema Zod replicado desde src/content.config.ts.
// No se importa directamente porque image() de Astro no funciona fuera del contexto Astro.
// cover se trata como string (ruta relativa tal como está en el frontmatter MDX).
import { z } from 'zod';

export const articuloSchema = z.object({
  title: z.string().max(70, 'Máximo 70 caracteres'),
  description: z
    .string()
    .min(120, 'Mínimo 120 caracteres')
    .max(160, 'Máximo 160 caracteres'),
  keyword: z.string().min(1, 'Requerido'),
  categoria: z.enum(['ejercicios', 'juegos', 'equipamiento', 'iniciacion', 'mundial-2026'], {
    errorMap: () => ({ message: 'Categoría no válida' }),
  }),
  autor: z.string().default('javier-tibamoza'),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  cover: z.string().min(1, 'Requerido'),
  coverAlt: z.string().min(1, 'Requerido'),
  edadMin: z.number().int().min(3).max(18),
  edadMax: z.number().int().min(3).max(18),
  nivel: z.enum(['facil', 'media', 'reto']),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  tiempoLectura: z.number().int().optional(),
  tieneAfiliados: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export function validateArticulo(data) {
  const result = articuloSchema.safeParse(data);
  if (result.success) return { valid: true, errors: {} };
  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key) errors[key] = issue.message;
  }
  return { valid: false, errors };
}
