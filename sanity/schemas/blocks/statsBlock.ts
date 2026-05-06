import { defineType, defineField } from 'sanity'

export const statsBlock = defineType({
  name: 'statsBlock',
  title: 'Stats',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Impact',
    }),
    defineField({
      name: 'items',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Number',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      description: 'Optional columns of credits shown below a divider — e.g. "Spring role" and "Partners".',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Column Label', type: 'string', validation: (Rule) => Rule.required() }),
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
            prepare({ label, items }) {
              return { title: label, subtitle: (items || []).join(', ') }
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
          { title: 'Full Width  · Max canvas',  value: 'full-width' },
          { title: 'Wide        · 1600px',      value: 'wide'       },
          { title: 'Medium      · 960px',       value: 'medium'     },
          { title: 'Contained   · 768px',       value: 'contained'  },
          { title: 'Narrow      · 560px',       value: 'narrow'     },
        ],
      },
      initialValue: 'contained',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare({ title, items }) {
      const count = items?.length || 0
      return {
        title: title || 'Stats',
        subtitle: `Stats · ${count} item${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
