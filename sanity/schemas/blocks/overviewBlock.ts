import { defineType, defineField } from 'sanity'

export const overviewBlock = defineType({
  name: 'overviewBlock',
  title: 'Full Overview',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Full overview',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 12,
      description: 'The long-form write-up. Separate paragraphs with a blank line.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      description: 'Columns shown in the side rail — e.g. "Spring role" and "Collaborators".',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Column Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: 'label', items: 'items' },
            prepare({ title, items }) {
              return { title, subtitle: (items || []).join(', ') }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Full Width  · Max canvas', value: 'full-width' },
          { title: 'Wide        · 1600px',     value: 'wide'       },
          { title: 'Medium      · 960px',      value: 'medium'     },
          { title: 'Contained   · 768px',      value: 'contained'  },
          { title: 'Narrow      · 560px',      value: 'narrow'     },
        ],
      },
      initialValue: 'contained',
    }),
  ],
  preview: {
    select: { title: 'title', body: 'body' },
    prepare({ title, body }) {
      return {
        title: title || 'Full overview',
        subtitle: body ? `Overview · ${String(body).slice(0, 60)}…` : 'Overview',
      }
    },
  },
})
