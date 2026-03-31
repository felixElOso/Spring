'use client'

import { motion } from 'framer-motion'
import type { TextBlock as TextBlockType } from '@/lib/sanity/types'

interface Props {
  block: TextBlockType
}

export function TextBlockRenderer({ block }: Props) {
  const isHalf = block.layout === 'half'
  const isContained = block.layout === 'contained'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={isHalf ? '' : `section-pad py-12 md:py-16 ${isContained ? 'max-w-[var(--max-w-content)] mx-auto' : ''}`}
    >
      <div className={isContained ? 'max-w-3xl' : ''}>
        {block.title && (
          <h4 className="text-lg md:text-xl font-medium tracking-tight text-foreground">
            {block.title}
          </h4>
        )}
        {block.body && (
          <p className={`text-base leading-relaxed text-muted-foreground ${block.title ? 'mt-4' : ''}`}>
            {block.body}
          </p>
        )}
      </div>
    </motion.div>
  )
}
