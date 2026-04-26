import type { CollectionEntry } from 'astro:content';

type CategoryEntry = CollectionEntry<'categorias'>;
type ColorName = CategoryEntry['data']['color'];

const COLOR_TO_HEX: Record<ColorName, string> = {
  primary: '#2563EB',
  secondary: '#16A34A',
  accent: '#F59E0B',
  fun: '#EC4899',
  energy: '#DC2626',
  info: '#0891B2',
};

const COLOR_TO_VAR: Record<ColorName, string> = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  fun: 'var(--color-fun)',
  energy: 'var(--color-energy)',
  info: 'var(--color-info)',
};

export function categoryColorHex(color: ColorName): string {
  return COLOR_TO_HEX[color];
}

export function categoryColorVar(color: ColorName): string {
  return COLOR_TO_VAR[color];
}

/** Devuelve la URL pública de la categoría (`/<slug>/`). */
export function categoryHref(slug: string): string {
  return `/${slug}/`;
}
