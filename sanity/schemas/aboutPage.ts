import { defineType, defineField } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'statement',
      title: 'Statement',
      type: 'text',
      rows: 4,
      description:
        'The large display statement shown under the hero image. Press Enter to control where each line wraps — those breaks are held at every screen size instead of reflowing.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'statementHighlight',
      title: 'Statement highlight',
      type: 'string',
      description: 'Word or phrase within the statement to render in coral (e.g. "TurboTax"). Must match the text in Statement exactly.',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Shown in the "What we do" section.',
    }),
    defineField({
      name: 'contactLinks',
      title: 'Contact links',
      type: 'array',
      description: 'Shown in the "Contact us" section.',
      of: [
        {
          type: 'object',
          name: 'contactLink',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              description: 'Destination — e.g. mailto:hello@spring.com, https://instagram.com/…',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'About Page' }
    },
  },
})
