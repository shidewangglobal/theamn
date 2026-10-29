import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

const walkHtml = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walkHtml(full);
      return entry.name.endsWith('.html') ? [full] : [];
    }),
  );
  return nested.flat();
};

const field = (html: string, pattern: RegExp) => html.match(pattern)?.[1]?.trim() ?? '';

const pathOf = (url: string) => {
  const parsed = new URL(url);
  const pathname = parsed.pathname.replace(/\/$/, '') || '/';
  return pathname;
};

export function seoAudit(): AstroIntegration {
  return {
    name: 'seo-audit',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        const htmlFiles = await walkHtml(root);
        const sitemapFiles = (await walkHtml(root).then(() => readdir(root))).filter((name) =>
          name.startsWith('sitemap') && name.endsWith('.xml'),
        );
        const sitemapText = (
          await Promise.all(sitemapFiles.map((name) => readFile(path.join(root, name), 'utf8')))
        ).join('\n');
        const sitemapPaths = new Set(
          [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => pathOf(match[1])),
        );

        const problems: string[] = [];
        const titles = new Map<string, string>();

        if (!sitemapText.includes('<loc>')) {
          problems.push('Sitemap has no URLs.');
        }

        for (const file of htmlFiles) {
          const html = await readFile(file, 'utf8');
          const label = path.relative(root, file);
          const robots = field(html, /<meta name="robots" content="([^"]*)"/);
          if (robots.includes('noindex')) continue;

          const title = field(html, /<title>([^<]*)<\/title>/);
          const description = field(html, /<meta name="description" content="([^"]*)"/);
          const canonical = field(html, /<link rel="canonical" href="([^"]+)"/);
          const checks: [string, string][] = [
            ['title', title],
            ['description', description],
            ['canonical', canonical],
            ['robots', robots],
            ['og:title', field(html, /<meta property="og:title" content="([^"]*)"/)],
            ['og:description', field(html, /<meta property="og:description" content="([^"]*)"/)],
            ['og:url', field(html, /<meta property="og:url" content="([^"]*)"/)],
            ['og:image', field(html, /<meta property="og:image" content="([^"]*)"/)],
            ['twitter:card', field(html, /<meta name="twitter:card" content="([^"]*)"/)],
          ];

          for (const [name, value] of checks) {
            if (!value) problems.push(`${label} is missing ${name}.`);
          }

          if (canonical && !canonical.startsWith('https://theamn.network')) {
            problems.push(`${label} canonical is not on https://theamn.network.`);
          }

          if (canonical && canonical !== field(html, /<meta property="og:url" content="([^"]*)"/)) {
            problems.push(`${label} canonical and og:url do not match.`);
          }

          const h1Count = html.match(/<h1[\s>]/g)?.length ?? 0;
          if (h1Count !== 1) problems.push(`${label} has ${h1Count} h1 headings.`);

          if (!html.includes('application/ld+json')) problems.push(`${label} is missing JSON-LD.`);

          if (canonical) {
            const canonicalPath = pathOf(canonical);
            if (!sitemapPaths.has(canonicalPath)) {
              problems.push(`${label} canonical ${canonicalPath} is not in the sitemap.`);
            }
          }

          if (title) {
            const previous = titles.get(title);
            if (previous) problems.push(`Duplicate title "${title}" on ${previous} and ${label}.`);
            else titles.set(title, label);
          }
        }

        if (problems.length > 0) {
          throw new Error(`Technical SEO check failed:\n- ${problems.join('\n- ')}`);
        }
      },
    },
  };
}
