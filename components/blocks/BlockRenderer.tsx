import { RichTextBlock } from './RichTextBlock'
import { ImageBlock } from './ImageBlock'
import { GalleryBlock } from './GalleryBlock'
import { VideoBlock } from './VideoBlock'
import { AnimationBlock } from './AnimationBlock'
import { TextBlockRenderer } from './TextBlock'
import { StatsBlock } from './StatsBlock'
import { HeadingBlock } from './HeadingBlock'
import { ImageMosaicBlock } from './ImageMosaicBlock'
import { MarqueeGalleryBlock } from './MarqueeGalleryBlock'
import { QuoteBlock } from './QuoteBlock'
import { BeforeAfterBlock } from './BeforeAfterBlock'
import type { ContentBlock } from '@/lib/sanity/types'

interface Props {
  blocks: ContentBlock[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isHalfBlock(block: ContentBlock): boolean {
  return (
    (block._type === 'textBlock' || block._type === 'headingBlock') &&
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
    case 'headingBlock':
      return <HeadingBlock key={block._key} block={block} />
    case 'imageMosaicBlock':
      return <ImageMosaicBlock key={block._key} block={block} />
    case 'marqueeGalleryBlock':
      return <MarqueeGalleryBlock key={block._key} block={block} />
    case 'quoteBlock':
      return <QuoteBlock key={block._key} block={block} />
    case 'beforeAfterBlock':
      return <BeforeAfterBlock key={block._key} block={block} />
    default:
      return null
  }
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

export function BlockRenderer({ blocks }: Props) {
  const grouped = groupBlocks(blocks)

  return (
    <>
      {grouped.map((item) => {
        if (item.type === 'half-row') {
          const isSingle = item.blocks.length === 1
          return (
            <div
              key={item.blocks[0]._key + '-row'}
              className={
                isSingle
                  ? 'section-pad py-24 md:py-32 max-w-3xl mx-auto'
                  : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 section-pad py-24 md:py-32 max-w-[var(--max-w-content)] mx-auto'
              }
            >
              {item.blocks.map((block) => renderBlock(block))}
            </div>
          )
        }
        return renderBlock(item.block)
      })}
    </>
  )
}
