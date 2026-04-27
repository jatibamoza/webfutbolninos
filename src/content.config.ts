import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const categoriasCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/categorias' }),
  schema: z.object({
    nombre: z.string(),
    slug: z.string(),
    descripcion: z.string(),
    descripcionCorta: z.string().max(120),
    color: z.enum(['primary', 'secondary', 'accent', 'fun', 'energy', 'info']),
    icono: z.string(),
    edadMin: z.number().int().min(3).max(18),
    edadMax: z.number().int().min(3).max(18),
    orden: z.number().int(),
    tagline: z.string().optional(),
  }),
});

const autoresCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/autores' }),
  schema: z.object({
    nombre: z.string(),
    slug: z.string(),
    bio: z.string().max(300),
    avatar: z.string(),
    titulacion: z.string().optional(),
    experiencia: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
  }),
});

const articulosCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articulos' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(120).max(160),
    keyword: z.string(),
    categoria: z.string(),
    autor: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: z.string(),
    coverAlt: z.string(),
    coverWidth: z.number().int().default(1200),
    coverHeight: z.number().int().default(750),
    edadMin: z.number().int().min(3).max(18),
    edadMax: z.number().int().min(3).max(18),
    nivel: z.enum(['facil', 'media', 'reto']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    tiempoLectura: z.number().int().optional(),
    tieneAfiliados: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const recursosCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/recursos' }),
  schema: z.object({
    titulo: z.string().max(70),
    descripcion: z.string().max(200),
    archivo: z.string(),
    preview: z.string(),
    paginas: z.number().int(),
    edadMin: z.number().int(),
    edadMax: z.number().int(),
    categoria: z.string(),
    gratuito: z.boolean().default(true),
    pubDate: z.coerce.date(),
  }),
});

export const collections = {
  categorias: categoriasCollection,
  autores: autoresCollection,
  articulos: articulosCollection,
  recursos: recursosCollection,
};
