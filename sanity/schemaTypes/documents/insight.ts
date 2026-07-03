import { defineArrayMember, defineField, defineType } from 'sanity';

export const insight = defineType({
  name: 'insight',
  title: 'Insight',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleEmphasis',
      title: 'Title emphasis (italic phrase)',
      type: 'string',
      group: 'content',
      description: 'Optional phrase shown in editorial italic style, matching the live Insights design.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Deck / excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Insights', value: 'Insights' },
          { title: 'Q&A', value: 'Q&A' },
          { title: 'Guides', value: 'Guides' },
        ],
        layout: 'radio',
      },
      initialValue: 'Insights',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Standard article', value: 'standard' },
          { title: 'Q&A (questions in body)', value: 'qa' },
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'table',
          title: 'Table',
          fields: [
            defineField({
              name: 'rows',
              title: 'Rows',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'array',
                  of: [defineArrayMember({ type: 'string' })],
                }),
              ],
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs (schema + accordion)',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'faqItem' })],
      validation: (Rule) => Rule.min(3).max(5),
    }),
    defineField({
      name: 'closingTitle',
      title: 'Closing title',
      type: 'string',
      group: 'content',
      initialValue: 'The bottom line',
    }),
    defineField({
      name: 'closing',
      title: 'Closing copy',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish date',
      type: 'datetime',
      group: 'settings',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedDate',
      title: 'Updated date',
      type: 'datetime',
      group: 'settings',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Insights hub',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'draft',
      title: 'Hide from website',
      type: 'boolean',
      group: 'settings',
      description: 'When enabled, this insight will not be published to theamn.network.',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Publish date, newest',
      name: 'publishDateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
      draft: 'draft',
    },
    prepare({ title, subtitle, media, draft }) {
      return {
        title: draft ? `${title} (hidden)` : title,
        subtitle,
        media,
      };
    },
  },
});
