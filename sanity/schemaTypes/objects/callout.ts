import { defineField, defineType } from 'sanity';

export const callout = defineType({
  name: 'callout',
  title: 'Callout / CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Info', value: 'info' },
          { title: 'CTA button', value: 'cta' },
        ],
        layout: 'radio',
      },
      initialValue: 'info',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button label',
      type: 'string',
      hidden: ({ parent }) => parent?.style !== 'cta',
    }),
    defineField({
      name: 'buttonUrl',
      title: 'Button URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
      hidden: ({ parent }) => parent?.style !== 'cta',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'style' },
  },
});
