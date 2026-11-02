import type { APIRoute } from 'astro';
import { getPublishedInsights } from '../lib/insights/repository';

export const prerender = true;

const site = 'https://theamn.network';

export const GET: APIRoute = async () => {
  const insights = (await getPublishedInsights()).filter((insight) => !insight.data.seo.noindex);
  const sections = insights.map((insight) => {
    const { data } = insight;
    const faqs = data.faqs.flatMap((faq) => ['', `**${faq.question.trim()}**`, faq.answer.trim()]);
    return [
      `## ${data.title}`,
      `URL: ${data.seo.canonicalUrl}`,
      `Published: ${data.publishDate.toISOString().slice(0, 10)}${data.updatedDate ? ` · Updated: ${data.updatedDate.toISOString().slice(0, 10)}` : ''}`,
      '',
      data.description,
      ...faqs,
    ].join('\n');
  });

  const body = [
    '# The AMN: full text',
    '',
    `> Answers and summaries from ${site}. The AMN is a business growth and investment network for original brands and premium hospitality, based in Ho Chi Minh City, Vietnam. Short index: ${site}/llms.txt`,
    '',
    ...sections.flatMap((section) => [section, '']),
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
