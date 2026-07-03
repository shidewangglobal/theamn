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
    '/about': '/#about',
    '/services': '/#services',
    '/contact': '/#contact',
    '/preview': '/',
    '/preview/': '/',
    '/articles': '/',
    '/services/seo-geo': '/',
    '/preview/archetypes': '/',
    '/preview/case-studies': '/',
  },
});
