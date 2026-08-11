import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Drag-and-drop ordered project list — this order drives the site's work grid
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title('About Page')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'aboutPage' && item.getId() !== 'project'
      ),
    ])
