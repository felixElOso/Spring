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
      description: 'Add 2–4 images. Set each to Large or Small to control sizing. Large images take up more space; small ones stack together.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
            { name: 'caption', type: 'string', title: 'Caption' },
            { name: 'altText', type: 'string', title: 'Alt Text' },
            {
              name: 'size',
              type: 'string',
              title: 'Size',
              options: {
                list: [
                  { title: 'Large', value: 'large' },
                  { title: 'Small', value: 'small' },
                ],
              },
              initialValue: 'large',
            },
          ],
          preview: {
            select: { title: 'altText', media: 'image', size: 'size' },
            prepare({ title, media, size }) {
              return {
                title: title || 'Image',
                subtitle: size === 'large' ? 'Large' : 'Small',
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(2).max(4),
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
