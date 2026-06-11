import { defineType, defineField } from 'sanity'

// Reusable per-image object — used by both the legacy `images` array and the
// `rows` array, so the two share identical fields and previews.
const mosaicImageFields = [
  {
    name: 'mediaType',
    type: 'string',
    title: 'Media Type',
    options: {
      list: [
        { title: 'Image', value: 'image' },
        { title: 'Video', value: 'video' },
        { title: 'Before / After', value: 'beforeAfter' },
      ],
      layout: 'radio',
    },
    initialValue: 'image',
  },
  { name: 'image', type: 'image', title: 'Image', options: { hotspot: true }, hidden: ({ parent }: any) => parent?.mediaType !== 'image' && parent?.mediaType !== undefined },
  // ── Video (file or Vimeo/YouTube embed) ──────────────────────────────────
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
  { name: 'videoAutoplay', type: 'boolean', title: 'Autoplay (always muted)', initialValue: false, hidden: ({ parent }: any) => parent?.mediaType !== 'video' },
  // ── Before / After ───────────────────────────────────────────────────────
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
    description: 'Used by the Side by Side and Feature styles. Ignored by Custom Rows (images in a row share the width evenly).',
    options: {
      list: [
        { title: 'Large', value: 'large' },
        { title: 'Small', value: 'small' },
      ],
    },
    initialValue: 'large',
  },
  {
    name: 'stroke',
    type: 'boolean',
    title: 'Stroke',
    description: 'Add a subtle 1px border around this image.',
    initialValue: false,
  },
]

const mosaicImagePreview = {
  select: { title: 'altText', media: 'image', beforeImage: 'beforeImage', size: 'size', mediaType: 'mediaType', caption: 'caption', videoType: 'videoType' },
  prepare({ title, media, beforeImage, size, mediaType, caption, videoType }: any) {
    const isBA = mediaType === 'beforeAfter'
    const isVideo = mediaType === 'video'
    const kind = isBA ? 'Before/After' : isVideo ? 'Video' : 'Image'
    return {
      title: title || caption || kind,
      subtitle: `${kind} · ${size === 'large' ? 'Large' : 'Small'}${isVideo && videoType ? ` (${videoType})` : ''}`,
      media: isBA ? beforeImage : media,
    }
  },
}

const mosaicImageObject = {
  type: 'object',
  fields: mosaicImageFields,
  preview: mosaicImagePreview,
}

export const imageMosaicBlock = defineType({
  name: 'imageMosaicBlock',
  title: 'Image Mosaic',
  type: 'object',
  fields: [
    defineField({
      name: 'mosaicStyle',
      title: 'Mosaic Style',
      type: 'string',
      description: 'Controls how images are arranged.',
      options: {
        list: [
          { title: 'Side by Side', value: 'side-by-side' },
          { title: 'Feature — Large top, small below', value: 'feature' },
          { title: 'Custom Rows — mix side-by-side & stacked', value: 'rows' },
        ],
      },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Add 2 or more images. Set each to Large or Small to control sizing. Large images take up more space; small ones stack together.',
      hidden: ({ parent }: any) => parent?.mosaicStyle === 'rows',
      of: [mosaicImageObject],
      validation: (Rule) =>
        Rule.custom((images: unknown[] | undefined, context: any) => {
          // Only required for the legacy (non-row) styles.
          if (context?.parent?.mosaicStyle === 'rows') return true
          if (!images || images.length < 2) return 'Add at least 2 images.'
          return true
        }),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      description: 'Each row lays its cells out side-by-side with equal widths. A cell holds one image, or several images stacked vertically — so you can put a large image on the left and two smaller stacked images on the right. Stack multiple rows to mix arrangements freely.',
      hidden: ({ parent }: any) => parent?.mosaicStyle !== 'rows',
      of: [
        {
          type: 'object',
          name: 'mosaicRow',
          title: 'Row',
          fields: [
            {
              name: 'rowHeight',
              title: 'Row Height',
              description:
                'Auto lets each item keep its natural aspect ratio. Tall / Extra Tall give the whole row a fixed height (from tablet up) so every item stays tall and fills it — useful when two items side-by-side would otherwise shrink.',
              type: 'string',
              options: {
                list: [
                  { title: 'Auto · natural aspect ratio', value: 'auto' },
                  { title: 'Tall · 70vh', value: 'tall' },
                  { title: 'Extra Tall · 90vh', value: 'xtall' },
                ],
                layout: 'radio',
              },
              initialValue: 'auto',
            },
            // Legacy flat image list — superseded by `cells`. Kept (hidden) so
            // existing documents created before the cells change don't surface
            // "unknown field" errors in the Studio. The renderer still reads it.
            {
              name: 'images',
              title: 'Images (legacy)',
              type: 'array',
              of: [mosaicImageObject],
              // Hide once migrated to cells, or when there's no legacy data.
              hidden: ({ parent }: any) =>
                (parent?.cells?.length ?? 0) > 0 || !parent?.images || parent.images.length === 0,
              readOnly: true,
              description: 'Older content created before cells were introduced. Move these into Cells to edit them.',
            },
            {
              name: 'cells',
              title: 'Cells in this row',
              description: 'Each cell sits side-by-side with the others. A cell with multiple images stacks them vertically.',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'mosaicCell',
                  title: 'Cell',
                  fields: [
                    {
                      name: 'images',
                      title: 'Images in this cell',
                      description: 'One image, or several stacked vertically.',
                      type: 'array',
                      of: [mosaicImageObject],
                      validation: (Rule: any) => Rule.required().min(1).max(4),
                    },
                  ],
                  preview: {
                    select: { images: 'images' },
                    prepare({ images }: any) {
                      const count = images?.length || 0
                      const first = images?.[0]
                      return {
                        title: count > 1 ? `Cell · ${count} stacked` : 'Cell · 1 image',
                        media: first?.mediaType === 'beforeAfter' ? first?.beforeImage : first?.image,
                      }
                    },
                  },
                },
              ],
              // Required unless this is a legacy row that still stores its
              // images in the old flat `images` field.
              validation: (Rule: any) =>
                Rule.max(4).custom((cells: unknown[] | undefined, context: any) => {
                  const hasLegacy = (context?.parent?.images?.length ?? 0) > 0
                  if (hasLegacy) return true
                  if (!cells || cells.length < 1) return 'Add at least 1 cell.'
                  return true
                }),
            },
          ],
          preview: {
            select: { cells: 'cells', images: 'images' },
            prepare({ cells, images }: any) {
              // Prefer cells; fall back to the legacy flat `images` list.
              const count = cells?.length || images?.length || 0
              const unit = cells?.length ? 'cell' : 'image'
              const first = cells?.[0]?.images?.[0] || images?.[0]
              return {
                title: `Row · ${count} ${unit}${count !== 1 ? 's' : ''} side-by-side`,
                media: first?.mediaType === 'beforeAfter' ? first?.beforeImage : first?.image,
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((rows: unknown[] | undefined, context: any) => {
          if (context?.parent?.mosaicStyle !== 'rows') return true
          if (!rows || rows.length < 1) return 'Add at least 1 row.'
          return true
        }),
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
      rows: 'rows',
      mosaicStyle: 'mosaicStyle',
    },
    prepare({ images, rows, mosaicStyle }) {
      if (mosaicStyle === 'rows') {
        const rowCount = rows?.length || 0
        const imgCount = (rows || []).reduce(
          (n: number, r: any) =>
            n + (r?.cells || []).reduce((m: number, c: any) => m + (c?.images?.length || 0), 0),
          0
        )
        const firstImg = rows?.[0]?.cells?.[0]?.images?.[0]
        return {
          title: `${imgCount} image${imgCount !== 1 ? 's' : ''} · ${rowCount} row${rowCount !== 1 ? 's' : ''}`,
          subtitle: 'Image Mosaic · Custom Rows',
          media: firstImg?.mediaType === 'beforeAfter' ? firstImg?.beforeImage : firstImg?.image,
        }
      }
      const count = images?.length || 0
      return {
        title: `${count} image${count !== 1 ? 's' : ''}`,
        subtitle: 'Image Mosaic',
        media: images?.[0]?.image,
      }
    },
  },
})
