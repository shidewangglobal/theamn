import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://theamn.network',
  server: {
    port: 4322,
  },
  integrations: [tailwind(), sitemap()],
  redirects: {
    '/about': '/marketing#about',
    '/services': '/marketing#services',
    '/contact': '/marketing#contact',
    '/preview': '/',
    '/preview/': '/',
    '/articles': '/insights',
    '/services/seo-geo': '/insights',
    '/preview/archetypes': '/',
    '/preview/case-studies': '/',
  },
});
