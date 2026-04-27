import { SITE, SITE_URL } from '@/consts';

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  image: string;
  pubDate: Date;
  updatedDate?: Date;
  authorName: string;
  authorUrl: string;
  categoria: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function articleJsonLd({
  title,
  description,
  url,
  image,
  pubDate,
  updatedDate,
  authorName,
  authorUrl,
  categoria,
}: ArticleJsonLdProps): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image: {
      '@type': 'ImageObject',
      url: image,
    },
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate ?? pubDate).toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    articleSection: categoria,
    inLanguage: SITE.locale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return JSON.stringify(schema);
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return JSON.stringify(schema);
}

export function organizationJsonLd(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [`https://twitter.com/${SITE.twitterHandle.replace('@', '')}`],
  };

  return JSON.stringify(schema);
}

interface PersonJsonLdProps {
  name: string;
  url: string;
  image?: string;
  sameAs?: string[];
  jobTitle?: string;
  description?: string;
}

export function personJsonLd({
  name,
  url,
  image,
  sameAs = [],
  jobTitle,
  description,
}: PersonJsonLdProps): string {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
  };

  if (image) schema.image = image;
  if (jobTitle) schema.jobTitle = jobTitle;
  if (description) schema.description = description;
  if (sameAs.length > 0) schema.sameAs = sameAs;

  return JSON.stringify(schema);
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
