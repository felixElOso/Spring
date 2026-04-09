'use client'

import { urlFor } from '@/lib/sanity/client'
import { Media } from '@/components/ui/media'
import type { MediaLayout, MediaRatio } from '@/components/ui/media'
import type { ImageBlock as ImageBlockType } from '@/lib/sanity/types'

interface Props {
  block: ImageBlockType
}

export function ImageBlock({ block }: Props) {
  if (!block.image) return null

  const src = urlFor(block.image).width(2400).quality(90).auto('format').fit('max').url()

  return (
    <Media
      type="image"
      src={src}
      alt={block.altText || ''}
      layout={(block.layout as MediaLayout) ?? 'contained'}
      aspectRatio={(block.aspectRatio as MediaRatio) ?? '16/9'}
      caption={block.caption}
    />
  )
}
