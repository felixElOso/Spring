'use client'

import { motion } from 'framer-motion'
import type { QuoteBlock as QuoteBlockType } from '@/lib/sanity/types'

interface Props {
  block: QuoteBlockType
}

export function QuoteBlock({ block }: Props) {
  const isContained = block.layout === 'contained' || !block.layout

  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`section-pad py-16 md:py-24 ${isContained ? 'max-w-[var(--max-w-content)] mx-auto' : ''}`}
    >
      <div className={isContained ? 'max-w-3xl mx-auto' : 'max-w-4xl mx-auto'}>
        <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-snug">
          &ldquo;{block.quote}&rdquo;
        </p>
        {block.attribution && (
          <p className="mt-6 text-sm text-foreground/60">
            {block.attribution}
          </p>
        )}
      </div>
    </motion.blockquote>
  )
}
