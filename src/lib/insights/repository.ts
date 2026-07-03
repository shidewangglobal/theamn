import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { getSanityClient, isSanityConfigured } from '../sanity/client';
import { resolveImageUrl, urlForImage } from '../sanity/image';
import { portableTextToHtml } from '../sanity/portableText';
import { insightSlug } from '../../utils/insights';
import {
  resolveInsightSeo,
  type InsightCategory,
  type InsightData,
  type InsightRecord,
} from './types';

const SITE_URL = 'https://theamn.network';

type SanityInsight = {
  _id: string;
  title: string;
  titleEmphasis?: string;
  slug: string;
  description: string;
  category: InsightCategory;
  coverImage?: unknown;
  body?: unknown[];
  faqs?: { question: string; answer: string }[];
  closingTitle?: string;
  closing?: string;
  publishDate: string;
  updatedDate?: string;
  featured?: boolean;
  seo?: {
    focusKeyphrase?: string;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: unknown;
    twitterCard?: 'summary' | 'summary_large_image';
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: unknown;
    noindex?: boolean;
    nofollow?: boolean;
  };
};

const INSIGHTS_QUERY = `*[_type == "insight" && draft != true && defined(slug.current)] | order(publishDate desc) {
  _id,
  title,
  titleEmphasis,
  "slug": slug.current,
  description,
  category,
  coverImage,
  body,
  faqs,
  closingTitle,
  closing,
  publishDate,
  updatedDate,
  featured,
  seo {
    focusKeyphrase,
    metaTitle,
    metaDescription,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    noindex,
    nofollow
  }
}`;

function mapSanityInsight(doc: SanityInsight): InsightRecord {
  const coverImage = resolveImageUrl(doc.coverImage);
  const seo = resolveInsightSeo({
    title: doc.title,
    description: doc.description,
    coverImage,
    slug: doc.slug,
    siteUrl: SITE_URL,
    seo: {
      ...doc.seo,
      ogImage: urlForImage(doc.seo?.ogImage) || coverImage,
      twitterImage:
        urlForImage(doc.seo?.twitterImage) || urlForImage(doc.seo?.ogImage) || coverImage,
    },
  });

  const data: InsightData = {
    title: doc.title,
    titleEmphasis: doc.titleEmphasis,
    description: doc.description,
    publishDate: new Date(doc.publishDate),
    updatedDate: doc.updatedDate ? new Date(doc.updatedDate) : undefined,
    category: doc.category,
    coverImage,
    featured: Boolean(doc.featured),
    closingTitle: doc.closingTitle || 'The bottom line',
    closing: doc.closing || '',
    faqs: doc.faqs ?? [],
    seo,
  };

  return {
    id: doc._id,
    slug: doc.slug,
    source: 'sanity',
    data,
    bodyHtml: portableTextToHtml(doc.body as never),
  };
}

async function getSanityInsights(): Promise<InsightRecord[]> {
  const client = getSanityClient();
  if (!client) return [];

  const docs = await client.fetch<SanityInsight[]>(INSIGHTS_QUERY);
  return docs.map(mapSanityInsight);
}

function mapMarkdownInsight(entry: CollectionEntry<'insights'>): InsightRecord {
  const slug = insightSlug(entry.id);
  const coverImage = entry.data.coverImage;
  const absoluteCover = coverImage.startsWith('http') ? coverImage : `${SITE_URL}${coverImage}`;

  const seo = resolveInsightSeo({
    title: entry.data.title,
    description: entry.data.description,
    coverImage: absoluteCover,
    slug,
    siteUrl: SITE_URL,
    seo: {
      metaTitle: entry.data.seoTitle,
      metaDescription: entry.data.seoDescription,
      ogImage: entry.data.ogImage
        ? entry.data.ogImage.startsWith('http')
          ? entry.data.ogImage
          : `${SITE_URL}${entry.data.ogImage}`
        : absoluteCover,
    },
  });

  const data: InsightData = {
    title: entry.data.title,
    titleEmphasis: entry.data.titleEmphasis,
    description: entry.data.description,
    publishDate: entry.data.publishDate,
    updatedDate: entry.data.updatedDate,
    category: entry.data.category,
    coverImage,
    featured: entry.data.featured,
    closingTitle: entry.data.closingTitle,
    closing: entry.data.closing,
    faqs: entry.data.faqs,
    seo,
  };

  return {
    id: entry.id,
    slug,
    source: 'markdown',
    data,
  };
}

async function getMarkdownInsights(): Promise<InsightRecord[]> {
  const entries = await getCollection('insights', ({ data }) => !data.draft);
  return entries.map(mapMarkdownInsight);
}

export async function getPublishedInsights(): Promise<InsightRecord[]> {
  if (isSanityConfigured()) {
    const sanityInsights = await getSanityInsights();
    if (sanityInsights.length > 0) {
      return sanityInsights.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
    }
  }

  const markdownInsights = await getMarkdownInsights();
  return markdownInsights.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export async function getInsightBySlug(slug: string): Promise<InsightRecord | undefined> {
  const insights = await getPublishedInsights();
  return insights.find((item) => item.slug === slug);
}

export type MarkdownInsightEntry = CollectionEntry<'insights'>;

export async function getMarkdownInsightContent(slug: string) {
  const entries = await getCollection('insights', ({ data }) => !data.draft);
  const entry = entries.find((item) => insightSlug(item.id) === slug);
  if (!entry) return null;
  const { Content } = await render(entry);
  return { entry, Content };
}
