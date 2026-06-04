'use client'

import { motion } from 'framer-motion'
import type { OverviewBlock as OverviewBlockType } from '@/lib/sanity/types'

interface Props {
  block: OverviewBlockType
}

export function OverviewBlock({ block }: Props) {
  const paragraphs = block.body.split(/\n\n+/).filter((p) => p.trim().length > 0)

  return (
    // Full-width container — mirrors the Impact (Stats) block so the content
    // shares the same left edge.
    <div className="py-12 md:py-16">
      {/* Divider — inset to the section padding so it aligns with the content
          rather than running flush to the browser edges. */}
      <div className="section-pad">
        <div className="h-px w-full bg-border" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="section-pad flex flex-col gap-12 lg:flex-row lg:gap-[140px] pt-12 md:pt-16"
      >
        {/* Body — primary column */}
        <div className="flex flex-col gap-5 lg:w-[648px] lg:flex-shrink-0">
          {block.title && (
            <h3 className="text-xl font-medium leading-[1.4] tracking-[-0.02em] text-muted-foreground">
              {block.title}
            </h3>
          )}
          <div className="text-xl font-normal leading-[1.4] tracking-[-0.02em] text-foreground">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className={i > 0 ? 'mt-6' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Credits — side rail, sits right after the body column */}
        {block.credits && block.credits.length > 0 && (
          <div className="flex flex-col gap-10">
            {block.credits.map((col) => (
              <div key={col._key} className="flex flex-col gap-5">
                <p className="text-xl font-medium leading-[1.4] tracking-[-0.02em] text-muted-foreground">
                  {col.label}
                </p>
                <ul className="text-xl font-normal leading-[1.4] tracking-[-0.02em] text-foreground">
                  {col.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
