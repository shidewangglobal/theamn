import { defineField, defineType } from 'sanity';

const charCount = (value: string | undefined, max: number) =>
  value ? `${value.length}/${max} characters` : `0/${max} characters`;

export const seo = defineType({
  name: 'seo',
  title: 'SEO (Yoast-style)',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: 'focusKeyphrase',
      title: 'Focus keyphrase',
      type: 'string',
      description: 'Primary phrase this article should rank for (like Yoast focus keyword).',
    }),
    defineField({
      name: 'metaTitle',
      title: 'SEO title',
      type: 'string',
      description: 'Search engine title. Recommended 50-60 characters.',
      validation: (Rule) => [
        Rule.max(70).warning('SEO titles over 70 characters are often truncated.'),
        Rule.custom((value) => {
          if (!value) return true;
          if (value.length < 30) return 'Consider a slightly longer SEO title (30-60 characters).';
          return true;
        }).warning(),
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Search snippet. Recommended 120-160 characters.',
      validation: (Rule) => [
        Rule.max(200).warning('Meta descriptions over 200 characters are often truncated.'),
        Rule.custom((value) => {
          if (!value) return true;
          if (value.length < 70) return 'Consider a longer meta description (120-160 characters).';
          return true;
        }).warning(),
      ],
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Optional override. Leave empty to use the default article URL.',
    }),
    defineField({
      name: 'ogTitle',
      title: 'Open Graph title',
      type: 'string',
      description: 'Social share title. Falls back to SEO title, then article title.',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph description',
      type: 'text',
      rows: 2,
      description: 'Social share description. Falls back to meta description.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      type: 'image',
      options: { hotspot: true },
      description: 'Recommended 1200x630. Falls back to cover image.',
    }),
    defineField({
      name: 'twitterCard',
      title: 'Twitter card type',
      type: 'string',
      options: {
        list: [
          { title: 'Summary large image', value: 'summary_large_image' },
          { title: 'Summary', value: 'summary' },
        ],
        layout: 'radio',
      },
      initialValue: 'summary_large_image',
    }),
    defineField({
      name: 'twitterTitle',
      title: 'Twitter title',
      type: 'string',
      description: 'Falls back to Open Graph title.',
    }),
    defineField({
      name: 'twitterDescription',
      title: 'Twitter description',
      type: 'text',
      rows: 2,
      description: 'Falls back to Open Graph description.',
    }),
    defineField({
      name: 'twitterImage',
      title: 'Twitter image',
      type: 'image',
      options: { hotspot: true },
      description: 'Falls back to Open Graph image.',
    }),
    defineField({
      name: 'noindex',
      title: 'Noindex',
      type: 'boolean',
      description: 'Discourage search engines from indexing this page.',
      initialValue: false,
    }),
    defineField({
      name: 'nofollow',
      title: 'Nofollow',
      type: 'boolean',
      description: 'Discourage search engines from following links on this page.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      metaTitle: 'metaTitle',
      metaDescription: 'metaDescription',
      focusKeyphrase: 'focusKeyphrase',
    },
    prepare({ metaTitle, metaDescription, focusKeyphrase }) {
      return {
        title: metaTitle || 'SEO settings',
        subtitle: [
          focusKeyphrase ? `Keyphrase: ${focusKeyphrase}` : null,
          metaDescription ? charCount(metaDescription, 160) : 'No meta description',
        ]
          .filter(Boolean)
          .join(' · '),
      };
    },
  },
});
