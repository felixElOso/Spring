import { defineType, defineField } from 'sanity'

export const marqueeGalleryBlock = defineType({
  name: 'marqueeGalleryBlock',
  title: 'Marquee Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      description: 'Each row scrolls continuously. Odd rows scroll left, even rows scroll right.',
      validation: (Rule) => Rule.min(1).max(4),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'images',
              title: 'Images',
              type: 'array',
              validation: (Rule) => Rule.min(2),
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'image', type: 'image', title: 'Front Image', options: { hotspot: true } },
                    { name: 'companionImage', type: 'image', title: 'Back Image (revealed on hover)', options: { hotspot: true } },
                    { name: 'altText', type: 'string', title: 'Alt Text' },
                  ],
                  preview: {
                    select: { title: 'altText', media: 'image' },
                    prepare({ title, media }) {
                      return {
                        title: title || 'Image',
                        media,
                      }
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { images: 'images' },
            prepare({ images }) {
              const count = images?.length || 0
              return { title: `Row — ${count} image${count !== 1 ? 's' : ''}` }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'speed',
      title: 'Speed',
      type: 'string',
      options: {
        list: [
          { title: 'Slow', value: 'slow' },
          { title: 'Medium', value: 'medium' },
          { title: 'Fast', value: 'fast' },
        ],
      },
    }),
    defineField({
      name: 'pauseOnHover',
      title: 'Pause on Hover',
      type: 'boolean',
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
    }),
  ],
  initialValue: {
    speed: 'medium',
    pauseOnHover: true,
    layout: 'full-bleed',
  },
  preview: {
    select: {
      rows: 'rows',
    },
    prepare({ rows }) {
      const rowCount = rows?.length || 0
      const totalImages = (rows || []).reduce(
        (sum: number, row: any) => sum + (row.images?.length || 0),
        0
      )
      return {
        title: `${totalImages} image${totalImages !== 1 ? 's' : ''} across ${rowCount} row${rowCount !== 1 ? 's' : ''}`,
        subtitle: 'Marquee Gallery',
      }
    },
  },
})
