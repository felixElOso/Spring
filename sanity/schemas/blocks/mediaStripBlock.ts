import { defineType, defineField } from 'sanity'

// A manually horizontally-scrollable strip of mixed-width media that all share
// the same height. Unlike Marquee Gallery, it does not auto-scroll — the viewer
// drags / swipes / trackpad-scrolls through the items. Supports images and video
// (uploaded files or Vimeo/YouTube embeds).
export const mediaStripBlock = defineType({
  name: 'mediaStripBlock',
  title: 'Media Strip',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      description:
        'A single row of images and videos at a shared height. Each item keeps its natural aspect ratio, so widths vary. Scroll horizontally to see them all.',
      validation: (Rule) => Rule.min(2),
      of: [
        {
          type: 'object',
          name: 'mediaStripItem',
          title: 'Item',
          fields: [
            {
              name: 'mediaType',
              type: 'string',
              title: 'Media Type',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Video', value: 'video' },
                ],
                layout: 'radio',
              },
              initialValue: 'image',
            },
            {
              name: 'image',
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
              hidden: ({ parent }: any) => parent?.mediaType === 'video',
            },
            // ── Video (file or Vimeo/YouTube embed) ──────────────────────────
            {
              name: 'videoType',
              type: 'string',
              title: 'Video Source',
              options: {
                list: [
                  { title: 'Vimeo', value: 'vimeo' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Uploaded File', value: 'file' },
                ],
              },
              initialValue: 'file',
              hidden: ({ parent }: any) => parent?.mediaType !== 'video',
            },
            {
              name: 'videoUrl',
              type: 'url',
              title: 'Video URL (Vimeo/YouTube)',
              hidden: ({ parent }: any) => parent?.mediaType !== 'video' || parent?.videoType === 'file',
            },
            {
              name: 'videoFile',
              type: 'file',
              title: 'Video File',
              options: { accept: 'video/*' },
              hidden: ({ parent }: any) => parent?.mediaType !== 'video' || (parent?.videoType && parent?.videoType !== 'file'),
            },
            {
              name: 'videoAspect',
              type: 'string',
              title: 'Video Aspect Ratio',
              description:
                'Used to size the video within the shared height (videos have no intrinsic ratio to measure). Ignored for images.',
              options: {
                list: [
                  { title: '16:9  · Widescreen', value: '16/9' },
                  { title: '4:3   · Standard',   value: '4/3'  },
                  { title: '3:2   · Photo',      value: '3/2'  },
                  { title: '1:1   · Square',     value: '1/1'  },
                  { title: '9:16  · Portrait',   value: '9/16' },
                ],
              },
              initialValue: '16/9',
              hidden: ({ parent }: any) => parent?.mediaType !== 'video',
            },
            { name: 'altText', type: 'string', title: 'Alt Text' },
          ],
          preview: {
            select: { title: 'altText', media: 'image', mediaType: 'mediaType', videoType: 'videoType' },
            prepare({ title, media, mediaType, videoType }: any) {
              const isVideo = mediaType === 'video'
              return {
                title: title || (isVideo ? 'Video' : 'Image'),
                subtitle: isVideo ? `Video${videoType ? ` · ${videoType}` : ''}` : 'Image',
                media,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'height',
      title: 'Strip Height',
      type: 'string',
      description: 'The shared height of every item. Widths flow from each item’s aspect ratio.',
      options: {
        list: [
          { title: 'Small',  value: 'small'  },
          { title: 'Medium', value: 'medium' },
          { title: 'Large',  value: 'large'  },
        ],
      },
      initialValue: 'medium',
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
      initialValue: 'full-bleed',
    }),
  ],
  initialValue: {
    height: 'medium',
    layout: 'full-bleed',
  },
  preview: {
    select: { items: 'items' },
    prepare({ items }: any) {
      const count = items?.length || 0
      const videos = (items || []).filter((i: any) => i.mediaType === 'video').length
      const firstImg = (items || []).find((i: any) => i.mediaType !== 'video')?.image
      const parts = [`${count} item${count !== 1 ? 's' : ''}`]
      if (videos) parts.push(`${videos} video${videos !== 1 ? 's' : ''}`)
      return {
        title: parts.join(' · '),
        subtitle: 'Media Strip',
        media: firstImg,
      }
    },
  },
})
