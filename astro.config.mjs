import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://theamn.network',
  integrations: [tailwind(), sitemap()],
  redirects: {
    '/about': '/#about',
    '/services': '/#services',
    '/contact': '/#contact',
    '/preview': '/',
    '/preview/': '/',
  },
});
