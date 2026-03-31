import { defineType, defineField } from 'sanity'

export const galleryBlock = defineType({
  name: 'galleryBlock',
  title: 'Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
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
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      initialValue: 2,
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: 'enableLightbox',
      title: 'Enable Lightbox',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: '16:9  · Widescreen', value: '16/9' },
          { title: '4:3   · Standard',   value: '4/3'  },
          { title: '3:2   · Photo',      value: '3/2'  },
          { title: '1:1   · Square',     value: '1/1'  },
          { title: '21:9  · Cinematic',  value: '21/9' },
          { title: '9:16  · Portrait',   value: '9/16' },
        ],
      },
      initialValue: '4/3',
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
