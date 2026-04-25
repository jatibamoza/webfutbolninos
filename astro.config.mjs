import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

import { SITE_URL } from './src/consts';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
    }),
    icon({
      iconDir: 'src/assets/icons',
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: [],
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
