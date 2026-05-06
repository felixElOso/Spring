'use client'

import { motion } from 'framer-motion'
import { StatTile } from '@/components/ui/stat-tile'
import type { StatsBlock as StatsBlockType } from '@/lib/sanity/types'

interface Props {
  block: StatsBlockType
}

export function StatsBlock({ block }: Props) {
  const isContained = block.layout !== 'full-width'
  return (
    <div
      className={`py-12 md:py-16 ${isContained ? 'max-w-[var(--max-w-content)] mx-auto' : ''}`}
    >
      {block.title && (
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="section-pad text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mb-12 md:mb-16"
        >
          {block.title}
        </motion.h3>
      )}
      <div className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-visible scrollbar-hide section-pad">
        {block.items.map((stat, i) => (
          <motion.div
            key={stat._key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
            className="flex-shrink-0 w-[360px]"
          >
            <StatTile
              value={stat.value}
              label={stat.label}
              description={stat.description}
            />
          </motion.div>
        ))}
      </div>

      {block.credits && block.credits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="section-pad mt-12 md:mt-16"
        >
          <div className="border-t border-border pt-8 md:pt-10">
            <div className="flex flex-wrap gap-x-24 gap-y-8">
              {block.credits.map((col) => (
                <div key={col._key}>
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3">
                    {col.label}
                  </p>
                  <ul className="space-y-1">
                    {col.items.map((item, i) => (
                      <li key={i} className="text-sm text-foreground/70">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
