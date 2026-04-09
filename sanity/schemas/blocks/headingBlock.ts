import { defineType, defineField } from 'sanity'

export const headingBlock = defineType({
  name: 'headingBlock',
  title: 'Heading (H4)',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Heading Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Contained', value: 'contained' },
          { title: 'Full Width', value: 'full-width' },
          { title: 'Half Width', value: 'half' },
        ],
      },
      initialValue: 'contained',
    }),
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare({ text }) {
      return {
        title: text || 'Untitled heading',
        subtitle: 'Heading',
      }
    },
  },
})
