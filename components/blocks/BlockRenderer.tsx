import { RichTextBlock } from './RichTextBlock'
import { ImageBlock } from './ImageBlock'
import { GalleryBlock } from './GalleryBlock'
import { VideoBlock } from './VideoBlock'
import { AnimationBlock } from './AnimationBlock'
import { TextBlockRenderer } from './TextBlock'
import { StatsBlock } from './StatsBlock'
import { OverviewBlock } from './OverviewBlock'
import { HeadingBlock } from './HeadingBlock'
import { ImageMosaicBlock } from './ImageMosaicBlock'
import { MarqueeGalleryBlock } from './MarqueeGalleryBlock'
import { MediaStripBlock } from './MediaStripBlock'
import { QuoteBlock } from './QuoteBlock'
import { BeforeAfterBlock } from './BeforeAfterBlock'
import { CustomerCirclesBlock } from './CustomerCirclesBlock'
import { HeadingH2Block } from './HeadingH2Block'
import type { ContentBlock } from '@/lib/sanity/types'

interface Props {
  blocks: ContentBlock[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isHalfBlock(block: ContentBlock): boolean {
  return (
    (block._type === 'textBlock' ||
      block._type === 'headingBlock' ||
      block._type === 'headingH2Block') &&
    (block as { layout?: string }).layout === 'half'
  )
}

type GroupedItem =
  | { type: 'single'; block: ContentBlock }
  | { type: 'half-row'; blocks: ContentBlock[] }

/** Group consecutive half-width blocks into pairs for side-by-side rendering. */
function groupBlocks(blocks: ContentBlock[]): GroupedItem[] {
  const result: GroupedItem[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (isHalfBlock(block)) {
      const group: ContentBlock[] = [block]
      // Collect the next block too if it's also half (max 2 per row)
      if (i + 1 < blocks.length && isHalfBlock(blocks[i + 1])) {
        i++
        group.push(blocks[i])
      }
      result.push({ type: 'half-row', blocks: group })
    } else {
      result.push({ type: 'single', block })
    }

    i++
  }

  return result
}

function renderBlock(block: ContentBlock) {
  switch (block._type) {
    case 'richTextBlock':
      return <RichTextBlock key={block._key} block={block} />
    case 'imageBlock':
      return <ImageBlock key={block._key} block={block} />
    case 'galleryBlock':
      return <GalleryBlock key={block._key} block={block} />
    case 'videoBlock':
      return <VideoBlock key={block._key} block={block} />
    case 'animationBlock':
      return <AnimationBlock key={block._key} block={block} />
    case 'textBlock':
      return <TextBlockRenderer key={block._key} block={block} />
    case 'statsBlock':
      return <StatsBlock key={block._key} block={block} />
    case 'overviewBlock':
      return <OverviewBlock key={block._key} block={block} />
    case 'headingBlock':
      return <HeadingBlock key={block._key} block={block} />
    case 'headingH2Block':
      return <HeadingH2Block key={block._key} block={block} />
    case 'imageMosaicBlock':
      return <ImageMosaicBlock key={block._key} block={block} />
    case 'marqueeGalleryBlock':
      return <MarqueeGalleryBlock key={block._key} block={block} />
    case 'mediaStripBlock':
      return <MediaStripBlock key={block._key} block={block} />
    case 'quoteBlock':
      return <QuoteBlock key={block._key} block={block} />
    case 'beforeAfterBlock':
      return <BeforeAfterBlock key={block._key} block={block} />
    case 'customerCirclesBlock':
      return <CustomerCirclesBlock key={block._key} block={block} />
    default:
      return null
  }
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

// Whether a grouped item is marked Tight. For a half-row, the first block's
// spacing wins.
function isTight(item: GroupedItem): boolean {
  const block = item.type === 'half-row' ? item.blocks[0] : item.block
  return (block as { spacing?: string }).spacing === 'tight'
}

export function BlockRenderer({ blocks }: Props) {
  const grouped = groupBlocks(blocks)

  return (
    // Vertical rhythm is driven by each item's top margin (not a container gap),
    // so any block can opt into tight spacing via its Spacing field. The gap
    // between two items is tight (40px) when EITHER neighbour is Tight — so a
    // single toggle closes both sides of a block and two adjacent tight blocks
    // share one 40px gap. The first item gets no top margin.
    //
    // Blocks also carry their own internal vertical padding (MEDIA_SPACING), so
    // for a tight gap to read as a true 40px between content we zero the touching
    // padding: data-tight-above on the lower item, data-tight-below on the upper
    // one (see the CSS helpers in globals.css).
    <div className="flex flex-col">
      {grouped.map((item, i) => {
        const tightAbove = i > 0 && (isTight(item) || isTight(grouped[i - 1]))
        const tightBelow =
          i < grouped.length - 1 && (isTight(item) || isTight(grouped[i + 1]))
        const marginClass =
          i === 0 ? '' : tightAbove ? 'mt-10' : 'mt-24 md:mt-[200px]'
        const tightProps = {
          ...(tightAbove ? { 'data-tight-above': '' } : {}),
          ...(tightBelow ? { 'data-tight-below': '' } : {}),
        }

        if (item.type === 'half-row') {
          const isSingle = item.blocks.length === 1
          return (
            <div
              key={item.blocks[0]._key + '-row'}
              {...tightProps}
              className={`${marginClass} ${
                isSingle
                  ? 'section-pad max-w-3xl mx-auto'
                  : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 section-pad max-w-[var(--max-w-content)] mx-auto'
              }`}
            >
              {item.blocks.map((block) => renderBlock(block))}
            </div>
          )
        }
        return (
          <div key={item.block._key} {...tightProps} className={marginClass || undefined}>
            {renderBlock(item.block)}
          </div>
        )
      })}
    </div>
  )
}
