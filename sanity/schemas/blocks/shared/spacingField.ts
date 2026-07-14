import { defineField } from 'sanity'

/**
 * Shared "Spacing" control for content blocks. Tight pulls the vertical gap on
 * BOTH sides of this block to 40px (for grouping related blocks); Normal keeps
 * the standard ~200px section rhythm. Read generically by the BlockRenderer:
 * the gap between two blocks is tight if EITHER neighbour is set to Tight, so a
 * single toggle closes both sides and two adjacent tight blocks don't conflict.
 *
 * Spread into a block's `fields` array: `...blockFields, spacingField()`.
 */
export function spacingField() {
  return defineField({
    name: 'spacing',
    title: 'Spacing',
    type: 'string',
    description:
      'Vertical space around this block. Tight = 40px on both sides, for grouping related blocks; Normal = the standard section spacing.',
    options: {
      list: [
        { title: 'Normal · standard section spacing', value: 'normal' },
        { title: 'Tight · 40px',                       value: 'tight'  },
      ],
      layout: 'radio',
    },
    initialValue: 'normal',
  })
}
