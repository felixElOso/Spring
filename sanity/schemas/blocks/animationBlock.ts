import { defineType, defineField } from 'sanity'

export const animationBlock = defineType({
  name: 'animationBlock',
  title: 'Animation',
  type: 'object',
  fields: [
    defineField({
      name: 'animationType',
      title: 'Animation Type',
      type: 'string',
      options: {
        list: [
          { title: 'Lottie JSON', value: 'lottie' },
          { title: 'GIF', value: 'gif' },
        ],
      },
    }),
    defineField({
      name: 'lottieFile',
      title: 'Lottie JSON File',
      type: 'file',
      options: { accept: '.json' },
    }),
    defineField({
      name: 'gifImage',
      title: 'GIF Image',
      type: 'image',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
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
          { title: 'Full Bleed  · Edge to edge',   value: 'full-bleed' },
          { title: 'Full Width  · Max canvas',      value: 'full-width' },
          { title: 'Wide        · 1600px',          value: 'wide'       },
          { title: 'Medium      · 960px',           value: 'medium'     },
          { title: 'Contained   · 768px',           value: 'contained'  },
          { title: 'Narrow      · 560px',           value: 'narrow'     },
        ],
      },
      initialValue: 'contained',
    }),
  ],
  preview: {
    select: {
      caption: 'caption',
      animationType: 'animationType',
      gifImage: 'gifImage',
    },
    prepare({ caption, animationType, gifImage }) {
      const type = animationType === 'lottie' ? 'Lottie' : animationType === 'gif' ? 'GIF' : 'Animation'
      return {
        title: caption || 'Untitled animation',
        subtitle: `Animation · ${type}`,
        media: gifImage,
      }
    },
  },
})
