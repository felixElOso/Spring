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
