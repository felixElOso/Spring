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
      className={isHalf ? '' : `section-pad py-24 md:py-32 ${isContained ? 'max-w-[var(--max-w-content)] mx-auto' : ''}`}
    >
      <div className={isContained ? 'max-w-3xl mx-auto' : ''}>
        {block.title && (
          <h4 className="text-lg md:text-xl font-medium tracking-tight text-foreground">
            {block.title}
          </h4>
        )}
        {block.body && (
          <div className={`text-2xl font-medium text-foreground/80 ${block.title ? 'mt-4' : ''}`}>
            {block.body.split(/\n\n+/).map((paragraph, i) => (
              <p key={i} className={i > 0 ? 'mt-6' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
