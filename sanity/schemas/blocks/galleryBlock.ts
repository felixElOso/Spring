import { defineType, defineField } from 'sanity'
import { spacingField } from './shared/spacingField'

export const galleryBlock = defineType({
  name: 'galleryBlock',
  title: 'Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Media',
      type: 'array',
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
                  { title: 'Video', value: 'video' },
                ],
                layout: 'radio',
              },
              initialValue: 'image',
            },
            { name: 'image', type: 'image', title: 'Image', options: { hotspot: true }, hidden: ({ parent }: any) => parent?.mediaType === 'video' },
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
            { name: 'videoUrl', type: 'url', title: 'Video URL (Vimeo/YouTube)', hidden: ({ parent }: any) => parent?.mediaType !== 'video' || parent?.videoType === 'file' },
            { name: 'videoFile', type: 'file', title: 'Video File', options: { accept: 'video/*' }, hidden: ({ parent }: any) => parent?.mediaType !== 'video' || (parent?.videoType && parent?.videoType !== 'file') },
            { name: 'videoAutoplay', type: 'boolean', title: 'Autoplay (always muted)', initialValue: true, hidden: ({ parent }: any) => parent?.mediaType !== 'video' },
            { name: 'caption', type: 'string', title: 'Caption' },
            { name: 'altText', type: 'string', title: 'Alt Text' },
          ],
          preview: {
            select: { title: 'altText', caption: 'caption', media: 'image', mediaType: 'mediaType', videoType: 'videoType' },
            prepare({ title, caption, media, mediaType, videoType }: any) {
              const isVideo = mediaType === 'video'
              return {
                title: title || caption || (isVideo ? 'Video' : 'Image'),
                subtitle: isVideo ? `Video${videoType ? ` (${videoType})` : ''}` : 'Image',
                media,
              }
            },
          },
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
          { title: 'Original · No crop', value: 'auto' },
        ],
      },
      initialValue: '4/3',
      description:
        'Original shows each image or video at its native proportions — nothing is cropped or stretched, so item heights may vary. Vimeo/YouTube embeds keep a 16:9 frame (the player letterboxes inside it).',
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
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description:
        'Fills a padded panel behind the gallery. Uses design-system colors only.',
      options: {
        list: [
          { title: 'None',  value: 'none'  },
          { title: 'Cream', value: 'cream' },
          { title: 'Ink',   value: 'ink'   },
          { title: 'Coral', value: 'coral' },
          { title: 'White', value: 'white' },
        ],
      },
      initialValue: 'none',
    }),
    spacingField(),
  ],
  preview: {
    select: {
      images: 'images',
      columns: 'columns',
    },
    prepare({ images, columns }) {
      const count = images?.length || 0
      return {
        title: `${count} image${count !== 1 ? 's' : ''}`,
        subtitle: `Gallery · ${columns || 2} columns`,
        media: images?.[0]?.image,
      }
    },
  },
})
