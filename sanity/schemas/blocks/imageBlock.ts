import { defineType, defineField } from 'sanity'

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
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
      initialValue: '16/9',
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
