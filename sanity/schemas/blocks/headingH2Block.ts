import { defineType, defineField } from 'sanity'
import { spacingField } from './shared/spacingField'

export const headingH2Block = defineType({
  name: 'headingH2Block',
  title: 'Heading (H2)',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Heading Text',
      type: 'text',
      rows: 3,
      description:
        'Press Enter to control where the heading wraps onto a new line.',
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
    spacingField(),
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare({ text }) {
      // Collapse line breaks for the Studio list preview.
      const flat = (text || '').replace(/\s*\n\s*/g, ' ').trim()
      return {
        title: flat || 'Untitled heading',
        subtitle: 'Heading (H2)',
      }
    },
  },
})
