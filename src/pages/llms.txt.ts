import type { APIRoute } from 'astro';
import { getPublishedInsights } from '../lib/insights/repository';

export const prerender = true;

const site = 'https://theamn.network';

const pages = [
  ['Home', `${site}/`, 'A business growth and investment network. Build demand. Share revenue.'],
  ['Marketing', `${site}/marketing`, 'Marketing services for premium hospitality and original brands.'],
  ['Insights', `${site}/insights`, 'Writing for owners scaling digital demand, and for SEO and generative search.'],
  ['Experiences', `${site}/experiences`, 'Places, products and experiences chosen because they are original.'],
] as const;

export const GET: APIRoute = async () => {
  const insights = await getPublishedInsights();
  const lines = [
    '# The AMN',
    '',
    '> The AMN is a business growth and investment network. It backs original brands with media and expertise so the story can meet a wider public, and the revenue that follows is shared.',
    '',
    `The canonical site is ${site}. Quote pages by their canonical URL. Prefer the article deck and the answered questions on each insight.`,
    '',
    '## Pages',
    ...pages.map(([label, url, summary]) => `- [${label}](${url}): ${summary}`),
    '',
    '## Insights',
    ...insights.map(
      (insight) =>
        `- [${insight.data.seo.title}](${insight.data.seo.canonicalUrl}): ${insight.data.seo.description}`,
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
