import { defineType, defineField } from 'sanity'

export const beforeAfterBlock = defineType({
  name: 'beforeAfterBlock',
  title: 'Before / After',
  type: 'object',
  fields: [
    defineField({
      name: 'beforeImage',
      title: 'Before Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'afterImage',
      title: 'After Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'beforeLabel',
      title: 'Before Label',
      type: 'string',
      initialValue: 'Before',
    }),
    defineField({
      name: 'afterLabel',
      title: 'After Label',
      type: 'string',
      initialValue: 'After',
    }),
    defineField({
      name: 'initialPosition',
      title: 'Initial Slider Position (%)',
      type: 'number',
      description: 'Where the divider starts — 50 means centered.',
      initialValue: 50,
      validation: (Rule) => Rule.min(10).max(90),
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: 'Auto  · Match image', value: 'auto' },
          { title: '16:9  · Widescreen',  value: '16/9' },
          { title: '4:3   · Standard',    value: '4/3'  },
          { title: '3:2   · Photo',       value: '3/2'  },
          { title: '1:1   · Square',      value: '1/1'  },
        ],
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Full Bleed  · Edge to edge',   value: 'full-bleed' },
          { title: 'Full Width  · Max canvas',      value: 'full-width' },
          { title: 'Wide        · 1600px',          value: 'wide'       },
          { title: 'Medium      · 960px',           value: 'medium'     },
          { title: 'Contained   · 768px',           value: 'contained'  },
          { title: 'Narrow      · 560px',           value: 'narrow'     },
        ],
      },
      initialValue: 'full-width',
    }),
  ],
  preview: {
    select: {
      beforeLabel: 'beforeLabel',
      afterLabel: 'afterLabel',
      beforeImage: 'beforeImage',
    },
    prepare({ beforeLabel, afterLabel, beforeImage }) {
      return {
        title: `${beforeLabel || 'Before'} → ${afterLabel || 'After'}`,
        subtitle: 'Before / After',
        media: beforeImage,
      }
    },
  },
})
