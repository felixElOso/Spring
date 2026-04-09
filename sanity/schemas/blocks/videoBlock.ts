import { defineType, defineField } from 'sanity'

export const videoBlock = defineType({
  name: 'videoBlock',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'videoType',
      title: 'Video Type',
      type: 'string',
      options: {
        list: [
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'Uploaded File', value: 'file' },
        ],
      },
    }),
    defineField({
      name: 'url',
      title: 'Video URL (Vimeo/YouTube)',
      type: 'url',
    }),
    defineField({
      name: 'file',
      title: 'Video File',
      type: 'file',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay (always muted)',
      type: 'boolean',
      initialValue: false,
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
          { title: 'Full Bleed', value: 'full-bleed' },
          { title: 'Full Width', value: 'full-width' },
          { title: 'Contained', value: 'contained' },
        ],
      },
      initialValue: 'full-width',
    }),
  ],
  preview: {
    select: {
      caption: 'caption',
      videoType: 'videoType',
      url: 'url',
    },
    prepare({ caption, videoType, url }) {
      const type = videoType ? videoType.charAt(0).toUpperCase() + videoType.slice(1) : 'Video'
      return {
        title: caption || url || 'Untitled video',
        subtitle: `Video · ${type}`,
      }
    },
  },
})
