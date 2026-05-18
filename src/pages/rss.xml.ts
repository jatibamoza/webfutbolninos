import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE, SITE_URL } from '@/consts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articulos = await getCollection(
    'articulos',
    ({ data }: CollectionEntry<'articulos'>) => !data.draft
  );

  const sorted = articulos.sort(
    (a: CollectionEntry<'articulos'>, b: CollectionEntry<'articulos'>) =>
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const response = await rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site?.toString() ?? SITE_URL,
    items: sorted.map((article: CollectionEntry<'articulos'>) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.pubDate,
      link: `/${article.id.replace(/\.mdx?$/, '')}/`,
      categories: [article.data.categoria],
    })),
    customData: `<language>es-es</language>`,
    stylesheet: false,
  });

  // RSS no es página HTML — pedimos a Google que no la trate como tal. Sin
  // esto, GSC se queja con "duplicada sin canonical" porque busca un
  // <link rel="canonical"> que un XML no puede tener.
  response.headers.set('X-Robots-Tag', 'noindex');
  return response;
}
