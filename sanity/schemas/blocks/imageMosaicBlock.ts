import { defineType, defineField } from 'sanity'

export const imageMosaicBlock = defineType({
  name: 'imageMosaicBlock',
  title: 'Image Mosaic',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Add exactly 3 images. The first image is the large one, the other two are stacked.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
            { name: 'caption', type: 'string', title: 'Caption' },
            { name: 'altText', type: 'string', title: 'Alt Text' },
          ],
        },
      ],
      validation: (Rule) => Rule.min(3).max(3),
    }),
    defineField({
      name: 'largeImagePosition',
      title: 'Large Image Position',
      type: 'string',
      description: 'Which side the large image appears on.',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Full Bleed', value: 'full-bleed' },
          { title: 'Full Width', value: 'full-width' },
          { title: 'Contained', value: 'contained' },
        ],
      },
      initialValue: 'full-width',
    }),
  ],
})
