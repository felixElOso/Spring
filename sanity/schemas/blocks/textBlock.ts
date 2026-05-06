import { defineType, defineField } from 'sanity'

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
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
          { title: 'Half Width  · Side by side', value: 'half'      },
        ],
      },
      initialValue: 'contained',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      body: 'body',
    },
    prepare({ title, body }) {
      const preview = body ? (body.length > 60 ? body.slice(0, 60) + '...' : body) : ''
      return {
        title: title || preview || 'Untitled text',
        subtitle: 'Text',
      }
    },
  },
})
