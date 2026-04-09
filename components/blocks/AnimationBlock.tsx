'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import { Media } from '@/components/ui/media'
import type { MediaLayout, MediaRatio } from '@/components/ui/media'
import type { AnimationBlock as AnimationBlockType } from '@/lib/sanity/types'

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((m) => m.Player),
  { ssr: false }
)

interface Props {
  block: AnimationBlockType
}

export function AnimationBlock({ block }: Props) {
  return (
    <Media
      type="animation"
      layout={(block.layout as MediaLayout) ?? 'contained'}
      aspectRatio={(block.aspectRatio as MediaRatio) ?? '16/9'}
      caption={block.caption}
      style={block.backgroundColor ? { backgroundColor: block.backgroundColor } : undefined}
    >
      {block.animationType === 'lottie' && block.lottieFile?.asset?.url ? (
        <Player autoplay loop src={block.lottieFile.asset.url} style={{ width: '100%' }} />
      ) : block.animationType === 'gif' && block.gifImage ? (
        <Image
          src={urlFor(block.gifImage).quality(90).auto('format').fit('max').url()}
          alt=""
          width={1200}
          height={800}
          className="w-full h-auto"
          unoptimized
        />
      ) : null}
    </Media>
  )
}
