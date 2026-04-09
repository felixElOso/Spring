import { defineType, defineField } from 'sanity'

export const richTextBlock = defineType({
  name: 'richTextBlock',
  title: 'Rich Text',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Pull Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Contained', value: 'contained' },
          { title: 'Full Width', value: 'full-width' },
        ],
      },
      initialValue: 'contained',
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }) {
      const firstBlock = (content || []).find((block: any) => block._type === 'block')
      const text = firstBlock?.children?.map((child: any) => child.text).join('') || 'Empty rich text'
      return {
        title: text.length > 60 ? text.slice(0, 60) + '...' : text,
        subtitle: 'Rich Text',
      }
    },
  },
})
