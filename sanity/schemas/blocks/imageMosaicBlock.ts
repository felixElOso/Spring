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
            {
              name: 'mediaType',
              type: 'string',
              title: 'Media Type',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Before / After', value: 'beforeAfter' },
                ],
                layout: 'radio',
              },
              initialValue: 'image',
            },
            { name: 'image', type: 'image', title: 'Image', options: { hotspot: true }, hidden: ({ parent }: any) => parent?.mediaType === 'beforeAfter' },
            { name: 'beforeImage', type: 'image', title: 'Before Image', options: { hotspot: true }, hidden: ({ parent }: any) => parent?.mediaType !== 'beforeAfter' },
            { name: 'afterImage', type: 'image', title: 'After Image', options: { hotspot: true }, hidden: ({ parent }: any) => parent?.mediaType !== 'beforeAfter' },
            { name: 'beforeLabel', type: 'string', title: 'Before Label', initialValue: 'Before', hidden: ({ parent }: any) => parent?.mediaType !== 'beforeAfter' },
            { name: 'afterLabel', type: 'string', title: 'After Label', initialValue: 'After', hidden: ({ parent }: any) => parent?.mediaType !== 'beforeAfter' },
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
            select: { title: 'altText', media: 'image', beforeImage: 'beforeImage', size: 'size', mediaType: 'mediaType' },
            prepare({ title, media, beforeImage, size, mediaType }) {
              const isBA = mediaType === 'beforeAfter'
              return {
                title: title || (isBA ? 'Before / After' : 'Image'),
                subtitle: `${isBA ? 'Before/After' : 'Image'} · ${size === 'large' ? 'Large' : 'Small'}`,
                media: isBA ? beforeImage : media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(2).max(4),
    }),
    defineField({
      name: 'mosaicStyle',
      title: 'Mosaic Style',
      type: 'string',
      description: 'Controls the arrangement of images.',
      options: {
        list: [
          { title: 'Side by Side', value: 'side-by-side' },
          { title: 'Feature — Large top, small below', value: 'feature' },
        ],
      },
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
  initialValue: {
    mosaicStyle: 'side-by-side',
    layout: 'full-width',
  },
  preview: {
    select: {
      images: 'images',
    },
    prepare({ images }) {
      const count = images?.length || 0
      return {
        title: `${count} image${count !== 1 ? 's' : ''}`,
        subtitle: 'Image Mosaic',
        media: images?.[0]?.image,
      }
    },
  },
})
