import { defineField, defineType } from 'sanity';

export const pullQuote = defineType({
  name: 'pullQuote',
  title: 'Pull quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Optional source or speaker.',
    }),
  ],
  preview: {
    select: { title: 'quote', subtitle: 'attribution' },
  },
});
