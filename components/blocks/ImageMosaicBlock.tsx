'use client'

import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { Media, MEDIA_OUTER, MEDIA_SPACING } from '@/components/ui/media'
import type { MediaLayout } from '@/components/ui/media'
import type { ImageMosaicBlock as ImageMosaicBlockType } from '@/lib/sanity/types'

interface Props {
  block: ImageMosaicBlockType
}

export function ImageMosaicBlock({ block }: Props) {
  const layout = (block.layout as MediaLayout) ?? 'full-width'
  const images = block.images ?? []
  const isRight = block.largeImagePosition === 'right'

  if (images.length < 3) return null

  const large = images[0]
  const smallTop = images[1]
  const smallBottom = images[2]

  const largeImage = (
    <Media
      type="image"
      src={urlFor(large.image).width(1200).auto('format').url()}
      alt={large.altText || ''}
      layout="thumbnail"
      aspectRatio="3/2"
      caption={large.caption}
      animate={false}
    />
  )

  const stackedImages = (
    <div className="flex flex-col gap-4">
      <Media
        type="image"
        src={urlFor(smallTop.image).width(800).auto('format').url()}
        alt={smallTop.altText || ''}
        layout="thumbnail"
        aspectRatio="4/3"
        caption={smallTop.caption}
        animate={false}
      />
      <Media
        type="image"
        src={urlFor(smallBottom.image).width(800).auto('format').url()}
        alt={smallBottom.altText || ''}
        layout="thumbnail"
        aspectRatio="4/3"
        caption={smallBottom.caption}
        animate={false}
      />
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className={`${MEDIA_OUTER[layout]} ${MEDIA_SPACING[layout]}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isRight ? (
          <>
            {stackedImages}
            {largeImage}
          </>
        ) : (
          <>
            {largeImage}
            {stackedImages}
          </>
        )}
      </div>
    </motion.div>
  )
}
