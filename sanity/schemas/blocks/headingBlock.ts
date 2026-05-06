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
          { title: 'Full Width  · Max canvas',   value: 'full-width' },
          { title: 'Wide        · 1600px',       value: 'wide'       },
          { title: 'Medium      · 960px',        value: 'medium'     },
          { title: 'Contained   · 768px',        value: 'contained'  },
          { title: 'Narrow      · 560px',        value: 'narrow'     },
          { title: 'Half Width  · Side by side', value: 'half'       },
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
