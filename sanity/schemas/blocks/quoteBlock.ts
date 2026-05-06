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
          { title: 'Full Width  · Max canvas',  value: 'full-width' },
          { title: 'Wide        · 1600px',      value: 'wide'       },
          { title: 'Medium      · 960px',       value: 'medium'     },
          { title: 'Contained   · 768px',       value: 'contained'  },
          { title: 'Narrow      · 560px',       value: 'narrow'     },
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
