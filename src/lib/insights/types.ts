export type InsightCategory = 'Insights' | 'Q&A' | 'Guides';

export type InsightFaq = {
  question: string;
  answer: string;
};

export type ResolvedSeo = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl?: string;
  focusKeyphrase?: string;
  noindex: boolean;
  nofollow: boolean;
};

export type InsightData = {
  title: string;
  titleEmphasis?: string;
  description: string;
  publishDate: Date;
  updatedDate?: Date;
  category: InsightCategory;
  coverImage: string;
  featured: boolean;
  author: string;
  closingTitle: string;
  closing: string;
  faqs: InsightFaq[];
  seo: ResolvedSeo;
};

export type InsightRecord = {
  id: string;
  slug: string;
  source: 'sanity' | 'markdown';
  data: InsightData;
  bodyHtml?: string;
};

export function resolveInsightSeo(input: {
  title: string;
  description: string;
  coverImage: string;
  seo?: {
    focusKeyphrase?: string;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    noindex?: boolean;
    nofollow?: boolean;
  };
  siteUrl: string;
  slug: string;
}): ResolvedSeo {
  const seo = input.seo ?? {};
  const title = seo.metaTitle?.trim() || input.title;
  const description = seo.metaDescription?.trim() || input.description;
  const ogTitle = seo.ogTitle?.trim() || title;
  const ogDescription = seo.ogDescription?.trim() || description;
  const ogImage = seo.ogImage?.trim() || input.coverImage;
  const twitterTitle = seo.twitterTitle?.trim() || ogTitle;
  const twitterDescription = seo.twitterDescription?.trim() || ogDescription;
  const twitterImage = seo.twitterImage?.trim() || ogImage;

  return {
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard: seo.twitterCard ?? 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonicalUrl: seo.canonicalUrl?.trim() || `${input.siteUrl}/insights/${input.slug}`,
    focusKeyphrase: seo.focusKeyphrase?.trim() || undefined,
    noindex: Boolean(seo.noindex),
    nofollow: Boolean(seo.nofollow),
  };
}
