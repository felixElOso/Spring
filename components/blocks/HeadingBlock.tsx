'use client'

import { motion } from 'framer-motion'
import type { HeadingBlock as HeadingBlockType } from '@/lib/sanity/types'

interface Props {
  block: HeadingBlockType
}

export function HeadingBlock({ block }: Props) {
  const isHalf = block.layout === 'half'
  const isContained = block.layout === 'contained'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={isHalf ? '' : `section-pad py-8 md:py-12 ${isContained ? 'max-w-[var(--max-w-content)] mx-auto' : ''}`}
    >
      <div className={isContained ? 'max-w-3xl' : ''}>
        <h4 className="text-2xl font-medium text-foreground">
          {block.text}
        </h4>
      </div>
    </motion.div>
  )
}
