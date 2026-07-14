'use client'

import { motion } from 'framer-motion'
import type { HeadingH2Block as HeadingH2BlockType } from '@/lib/sanity/types'

interface Props {
  block: HeadingH2BlockType
}

export function HeadingH2Block({ block }: Props) {
  const isHalf = block.layout === 'half'
  const isContained = block.layout === 'contained'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={isHalf ? '' : `section-pad ${isContained ? 'max-w-[var(--max-w-content)] mx-auto' : ''}`}
    >
      <div className={isContained ? 'max-w-3xl mx-auto' : ''}>
        {/* Design-system H2: text-4xl / medium / tight tracking, scaling up on
            larger screens. `whitespace-pre-line` renders the editor's Enter
            key presses as line breaks. */}
        <h2 className="whitespace-pre-line text-center text-4xl md:text-5xl font-medium tracking-tight text-muted-foreground">
          {block.text}
        </h2>
      </div>
    </motion.div>
  )
}
