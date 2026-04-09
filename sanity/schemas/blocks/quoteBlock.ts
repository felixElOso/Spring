import { defineType, defineField } from 'sanity'

export const quoteBlock = defineType({
  name: 'quoteBlock',
  title: 'Quote',
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
      description: 'Who said it — name, title, etc.',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Contained', value: 'contained' },
          { title: 'Full Width', value: 'full-width' },
        ],
      },
    }),
  ],
  initialValue: {
    layout: 'contained',
  },
  preview: {
    select: {
      quote: 'quote',
      attribution: 'attribution',
    },
    prepare({ quote, attribution }) {
      const text = quote?.length > 60 ? quote.slice(0, 60) + '...' : quote
      return {
        title: text || 'Empty quote',
        subtitle: attribution ? `Quote · ${attribution}` : 'Quote',
      }
    },
  },
})
