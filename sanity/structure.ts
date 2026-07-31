import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('About Page')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'aboutPage'),
    ])
