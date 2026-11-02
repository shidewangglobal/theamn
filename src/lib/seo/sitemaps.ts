// XML sitemaps in the Yoast style: /sitemap_index.xml lists typed sitemaps
// (pages, insights, experiences), each styled for browsers by /sitemap.xsl.
import { getCollection } from 'astro:content';
import { getPublishedInsights } from '../insights/repository';
import { insightSlug } from '../../utils/insights';
import { siteUrl } from './site';

/** Last content change of the static pages (bump when page copy changes). */
const PAGES_UPDATED = '2026-10-29T00:00:00.000Z';

type Url = {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
};

const abs = (path: string) => `${siteUrl}${path}`;

/** Most recent lastmod in a group (ISO strings compare chronologically). */
const newest = (urls: Url[], floor = PAGES_UPDATED) =>
  urls.reduce((latest, url) => (url.lastmod > latest ? url.lastmod : latest), floor);

export async function insightUrls(): Promise<Url[]> {
  const insights = await getPublishedInsights();
  return insights
    .filter((insight) => !insight.data.seo.noindex)
    .map((insight) => ({
      loc: insight.data.seo.canonicalUrl,
      lastmod: (insight.data.updatedDate ?? insight.data.publishDate).toISOString(),
      changefreq: 'monthly',
      priority: '0.7',
    }));
}

export async function experienceUrls(): Promise<Url[]> {
  const entries = await getCollection('experiences', ({ data }) => !data.draft);
  return entries.map((entry) => ({
    loc: abs(`/experiences/${insightSlug(entry.id)}`),
    lastmod: entry.data.publishDate.toISOString(),
    changefreq: 'monthly',
    priority: '0.6',
  }));
}

export async function pageUrls(): Promise<Url[]> {
  const [insights, experiences] = await Promise.all([insightUrls(), experienceUrls()]);
  return [
    { loc: abs('/'), lastmod: PAGES_UPDATED, changefreq: 'weekly', priority: '1.0' },
    { loc: abs('/marketing'), lastmod: PAGES_UPDATED, changefreq: 'monthly', priority: '0.9' },
    { loc: abs('/insights'), lastmod: newest(insights), changefreq: 'weekly', priority: '0.8' },
    { loc: abs('/experiences'), lastmod: newest(experiences), changefreq: 'monthly', priority: '0.7' },
  ];
}

export async function indexMaps() {
  const [pages, insights, experiences] = await Promise.all([pageUrls(), insightUrls(), experienceUrls()]);
  return [
    { loc: abs('/page-sitemap.xml'), lastmod: newest(pages) },
    { loc: abs('/insight-sitemap.xml'), lastmod: newest(insights) },
    { loc: abs('/experience-sitemap.xml'), lastmod: newest(experiences) },
  ];
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const STYLE = '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';

export function renderUrlset(urls: Url[]): string {
  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${esc(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n${STYLE}\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function renderIndex(maps: { loc: string; lastmod: string }[]): string {
  const body = maps
    .map((m) => `  <sitemap>\n    <loc>${esc(m.loc)}</loc>\n    <lastmod>${m.lastmod}</lastmod>\n  </sitemap>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n${STYLE}\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

export const xml = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
