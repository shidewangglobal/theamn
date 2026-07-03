import { defineField, defineType } from 'sanity';

export const bodyImage = defineType({
  name: 'bodyImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Required for SEO and accessibility. Describe what is in the image.',
      validation: (Rule) => Rule.required().min(5).max(160),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'alt', media: 'image' },
  },
});
