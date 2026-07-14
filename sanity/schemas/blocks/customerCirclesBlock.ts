import { defineType, defineField } from 'sanity'
import { spacingField } from './shared/spacingField'

export const customerCirclesBlock = defineType({
  name: 'customerCirclesBlock',
  title: 'Customer Circles',
  type: 'object',
  description:
    'A scattered cluster of customer headshots in circles. They drift gently, and on hover the circle grows and reveals a white card with the customer’s name and role.',
  fields: [
    defineField({
      name: 'customers',
      title: 'Customers',
      type: 'array',
      validation: (Rule) => Rule.min(3).error('Add at least 3 customers for a balanced cluster.'),
      of: [
        defineField({
          name: 'customer',
          title: 'Customer',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role / Location',
              type: 'string',
              description: 'e.g. “Small business owner · Austin, TX”. Shown on hover beneath the name.',
            }),
            defineField({
              name: 'size',
              title: 'Circle Size',
              type: 'string',
              description: 'Relative size in the cluster. Mix sizes for an organic feel.',
              options: {
                list: [
                  { title: 'Large', value: 'lg' },
                  { title: 'Medium', value: 'md' },
                  { title: 'Small', value: 'sm' },
                ],
                layout: 'radio',
              },
              initialValue: 'md',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'role', media: 'image' },
          },
        }),
      ],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Full Bleed  · Edge to edge', value: 'full-bleed' },
          { title: 'Full Width  · Max canvas', value: 'full-width' },
        ],
      },
      initialValue: 'full-bleed',
    }),
    spacingField(),
  ],
  preview: {
    select: {
      c0: 'customers.0.image',
      count: 'customers',
    },
    prepare({ c0, count }) {
      const n = Array.isArray(count) ? count.length : 0
      return {
        title: 'Customer Circles',
        subtitle: `${n} customer${n === 1 ? '' : 's'}`,
        media: c0,
      }
    },
  },
})
