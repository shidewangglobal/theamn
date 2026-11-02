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

const services = [
  ['Brand Storytelling & Content', 'Luxury content playbooks, social layouts and storytelling for premium hospitality.'],
  ['Conversion, Automation & AI B2C', 'Awareness campaigns, landing pages, a 24/7 digital sales concierge and email automation.'],
  ['SEO + GEO', 'Search and generative engine optimization for visibility in AI-generated answers.'],
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
    '## About',
    '- Business growth and investment network based in Ho Chi Minh City, Vietnam, operated by The AMN Limited.',
    '- Three pillars: Agile, Authentic, Accelerated. Pairs a luxury-taste professional network with the Advant Labs AI and automation stack.',
    '',
    '## Services',
    ...services.map(([label, summary]) => `- [${label}](${site}/marketing#services): ${summary}`),
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
    '## Contact',
    '- Email: dat.vuong@theamn.network',
    '- Phone: +84 905 930 309',
    '- Core hub: Ho Chi Minh City, Vietnam',
    '',
    '## Optional',
    `- [Full text with answered questions](${site}/llms-full.txt)`,
    `- [XML sitemap](${site}/sitemap_index.xml)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
