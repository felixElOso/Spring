'use client'

import { motion } from 'framer-motion'
import type { StatsBlock as StatsBlockType } from '@/lib/sanity/types'

interface Props {
  block: StatsBlockType
}

export function StatsBlock({ block }: Props) {
  const isContained = block.layout !== 'full-width'
  const count = block.items.length

  const colsClass =
    count <= 2
      ? 'grid-cols-2'
      : count === 3
        ? 'grid-cols-2 md:grid-cols-3'
        : 'grid-cols-2 md:grid-cols-4'

  return (
    <div
      className={`section-pad py-12 md:py-16 ${isContained ? 'max-w-[var(--max-w-content)] mx-auto' : ''}`}
    >
      <div className={`grid gap-8 md:gap-12 ${colsClass} place-items-center`}>
        {block.items.map((stat, i) => (
          <motion.div
            key={stat._key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
          >
            <div className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1] tracking-tight text-foreground text-center">
              {stat.value}
            </div>
            <div className="mt-3 text-base leading-relaxed text-muted-foreground text-center">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
