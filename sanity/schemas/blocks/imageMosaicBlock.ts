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
    description: 'Used by the Side by Side and Feature styles. Ignored by Custom Rows (images in a row share the width evenly).',
    options: {
      list: [
        { title: 'Large', value: 'large' },
        { title: 'Small', value: 'small' },
      ],
    },
    initialValue: 'large',
  },
]

const mosaicImagePreview = {
  select: { title: 'altText', media: 'image', beforeImage: 'beforeImage', size: 'size', mediaType: 'mediaType' },
  prepare({ title, media, beforeImage, size, mediaType }: any) {
    const isBA = mediaType === 'beforeAfter'
    return {
      title: title || (isBA ? 'Before / After' : 'Image'),
      subtitle: `${isBA ? 'Before/After' : 'Image'} · ${size === 'large' ? 'Large' : 'Small'}`,
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
      description: 'Each row lays its images out side-by-side with equal widths. Stack multiple rows to mix side-by-side and top/bottom arrangements freely. One image in a row = full width; two = split in half; three = thirds, and so on.',
      hidden: ({ parent }: any) => parent?.mosaicStyle !== 'rows',
      of: [
        {
          type: 'object',
          name: 'mosaicRow',
          title: 'Row',
          fields: [
            {
              name: 'images',
              title: 'Images in this row',
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
                title: `Row · ${count} image${count !== 1 ? 's' : ''} side-by-side`,
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
        const imgCount = (rows || []).reduce((n: number, r: any) => n + (r?.images?.length || 0), 0)
        const firstImg = rows?.[0]?.images?.[0]
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
