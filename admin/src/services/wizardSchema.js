import { z } from 'zod';

export const CATEGORIAS = [
  { id: 'iniciacion', label: 'Iniciación', abbr: 'IN', color: 'var(--color-primary)' },
  { id: 'ejercicios', label: 'Ejercicios', abbr: 'EJ', color: 'var(--color-secondary)' },
  { id: 'juegos', label: 'Juegos', abbr: 'JU', color: 'var(--color-fun)' },
  { id: 'equipamiento', label: 'Equipamiento', abbr: 'EQ', color: 'var(--color-accent)' },
  { id: 'recursos', label: 'Recursos', abbr: 'RC', color: 'var(--color-info)' },
  { id: 'mundial-2026', label: 'Mundial 2026', abbr: 'M26', color: 'var(--color-energy)' },
];

const CATEGORIA_IDS = CATEGORIAS.map((c) => c.id);
const NIVELES = ['facil', 'media', 'reto'];

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const step1Schema = z.object({
  categoria: z.enum(CATEGORIA_IDS, { message: 'Selecciona una categoría' }),
});

// Base sin .refine para poder merge-arlo en wizardFullSchema (refine devuelve ZodEffects, que no soporta .merge)
const step2Base = z.object({
  keyword: z.string().min(2, 'La keyword es obligatoria'),
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(70, 'Máximo 70 caracteres'),
  description: z
    .string()
    .min(120, 'Mínimo 120 caracteres')
    .max(160, 'Máximo 160 caracteres'),
  slug: z
    .string()
    .min(1, 'El slug es obligatorio')
    .regex(slugRegex, 'Solo minúsculas, números y guiones'),
  coverAlt: z.string().min(1, 'El alt de la cover es obligatorio'),
  edadMin: z.number().int().min(4).max(12),
  edadMax: z.number().int().min(4).max(12),
  nivel: z.enum(NIVELES, { message: 'Selecciona un nivel' }),
});

const edadRefine = (d) => d.edadMin <= d.edadMax;
const edadRefineMsg = { message: 'La edad mínima no puede superar la máxima', path: ['edadMax'] };

export const step2Schema = step2Base.refine(edadRefine, edadRefineMsg);

export const step3Schema = z.object({
  outline: z
    .array(
      z.object({
        id: z.string(),
        level: z.union([z.literal(2), z.literal(3)]),
        text: z.string().min(1, 'El texto del encabezado no puede estar vacío'),
      })
    )
    .min(3, 'Añade al menos 3 encabezados'),
});

export const wizardFullSchema = step1Schema
  .merge(step2Base)
  .merge(z.object({ outline: step3Schema.shape.outline }))
  .refine(edadRefine, edadRefineMsg);
