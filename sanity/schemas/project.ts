import { defineType, defineField } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'client', title: 'Client', type: 'string' }),
    defineField({ name: 'year', title: 'Year', type: 'number' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'thumbnailSize',
      title: 'Thumbnail Size',
      type: 'string',
      description: 'Controls the card size on the work grid. Large spans 2 columns on desktop.',
      options: {
        list: [
          { title: 'Regular', value: 'regular' },
          { title: 'Large', value: 'large' },
        ],
      },
      initialValue: 'regular',
    }),
    defineField({ name: 'coverVideo', title: 'Cover Video URL (hover)', type: 'url' }),
    defineField({
      name: 'coverVideoFile',
      title: 'Cover Video File',
      type: 'file',
      description: 'Upload a video file for the project thumbnail (plays on hover). Takes priority over Cover Video URL.',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'coverAnimation',
      title: 'Cover Animation',
      type: 'object',
      description: 'Upload a Lottie JSON or GIF for the project thumbnail.',
      fields: [
        defineField({
          name: 'animationType',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'Lottie', value: 'lottie' },
              { title: 'GIF', value: 'gif' },
            ],
          },
        }),
        defineField({
          name: 'lottieFile',
          title: 'Lottie JSON File',
          type: 'file',
          options: { accept: '.json' },
          hidden: ({ parent }) => parent?.animationType !== 'lottie',
        }),
        defineField({
          name: 'gifImage',
          title: 'GIF Image',
          type: 'image',
          hidden: ({ parent }) => parent?.animationType !== 'gif',
        }),
      ],
    }),
    defineField({
      name: 'contentBlocks',
      title: 'Content Blocks',
      type: 'array',
      of: [
        { type: 'richTextBlock' },
        { type: 'imageBlock' },
        { type: 'galleryBlock' },
        { type: 'videoBlock' },
        { type: 'animationBlock' },
        { type: 'textBlock' },
        { type: 'statsBlock' },
        { type: 'headingBlock' },
        { type: 'imageMosaicBlock' },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'SEO Title' },
        { name: 'description', type: 'text', title: 'SEO Description' },
        { name: 'ogImage', type: 'image', title: 'OG Image', options: { hotspot: true } },
      ],
    }),
  ],
  orderings: [
    { title: 'Year, New', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
})
