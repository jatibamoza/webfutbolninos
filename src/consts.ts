export const SITE_URL = 'https://minigolclub.com';
export const GA_ID = 'G-705L75RTFB';
export const ADSENSE_CLIENT = import.meta.env.PUBLIC_ADSENSE_CLIENT ?? '';
export const AMAZON_TAG = import.meta.env.PUBLIC_AMAZON_TAG ?? '';

export function amazonUrl(asin: string): string {
  const base = `https://www.amazon.es/dp/${asin}`;
  return AMAZON_TAG ? `${base}?tag=${AMAZON_TAG}` : base;
}

export function amazonSearchUrl(query: string): string {
  const params = new URLSearchParams({ k: query });
  if (AMAZON_TAG) params.set('tag', AMAZON_TAG);
  return `https://www.amazon.es/s?${params.toString()}`;
}

export const SITE = {
  name: 'MiniGol Club',
  domain: 'minigolclub.com',
  tagline: 'Fútbol para niños, explicado para padres',
  description:
    'Guías, ejercicios y consejos de fútbol infantil para padres con hijos de 4 a 12 años. Contenido cercano, sin tecnicismos.',
  locale: 'es-ES',
  defaultOgImage: '/og-default.jpg',
  twitterHandle: '@minigolclub',
} as const;

export const AUTHOR = {
  name: 'Javier Tibamoza',
  url: `${SITE_URL}/autores/javier-tibamoza/`,
  email: 'hola@minigolclub.com',
} as const;

/**
 * Navegación principal. `featured: true` renderiza un punto rojo a la
 * derecha del enlace — usado para destacar contenido temporal de alta
 * relevancia (ej. Mundial mientras está caliente). Tras el 21-jul-2026
 * (post-final), quitar la entrada de Mundial o el flag `featured`.
 */
export const NAV_PRIMARY = [
  { label: 'Ejercicios', href: '/ejercicios/' },
  { label: 'Juegos', href: '/juegos/' },
  { label: 'Equipamiento', href: '/equipamiento/' },
  { label: 'Iniciación', href: '/iniciacion/' },
  { label: 'Mundial 26', href: '/mundial-2026/', featured: true },
  { label: 'Recursos', href: '/recursos/' },
] as const;

export const NAV_FOOTER = [
  { label: 'Sobre nosotros', href: '/sobre/' },
  { label: 'Contacto', href: '/contacto/' },
  { label: 'Política de privacidad', href: '/politica-privacidad/' },
  { label: 'Política de cookies', href: '/politica-cookies/' },
  { label: 'Aviso legal', href: '/aviso-legal/' },
] as const;
