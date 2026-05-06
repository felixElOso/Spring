'use client'

import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { MEDIA_OUTER, MEDIA_SPACING } from '@/components/ui/media'
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider'
import type { BeforeAfterBlock as BeforeAfterBlockType } from '@/lib/sanity/types'

interface Props {
  block: BeforeAfterBlockType
}

export function BeforeAfterBlock({ block }: Props) {
  const {
    beforeImage,
    afterImage,
    beforeLabel = 'Before',
    afterLabel = 'After',
    initialPosition = 50,
    aspectRatio = 'auto',
    layout = 'full-width',
  } = block

  const beforeUrl = beforeImage
    ? urlFor(beforeImage).width(2400).quality(90).auto('format').fit('max').url()
    : null
  const afterUrl = afterImage
    ? urlFor(afterImage).width(2400).quality(90).auto('format').fit('max').url()
    : null

  if (!beforeUrl || !afterUrl) return null

  return (
    <motion.figure
      className={`${MEDIA_OUTER[layout]} ${MEDIA_SPACING[layout]}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <BeforeAfterSlider
        beforeUrl={beforeUrl}
        afterUrl={afterUrl}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
        initialPosition={initialPosition}
        aspectRatio={aspectRatio}
      />
    </motion.figure>
  )
}
