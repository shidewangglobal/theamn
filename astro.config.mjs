import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { seoAudit } from './src/integrations/seo-audit.ts';

export default defineConfig({
  site: 'https://theamn.network',
  trailingSlash: 'never',
  server: {
    port: 4322,
  },
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/llms.txt'),
    }),
    seoAudit(),
  ],
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
