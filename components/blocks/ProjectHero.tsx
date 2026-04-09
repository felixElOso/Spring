"use client"

import { motion } from "framer-motion"

interface ProjectHeroProps {
  title: string
  description?: string
  client?: string
  year?: number
  tags?: string[]
}

export function ProjectHero({
  title,
  description,
  client,
  year,
  tags,
}: ProjectHeroProps) {
  const hasMeta = client || year || (tags && tags.length > 0)

  return (
    <section className="section-pad pt-32 pb-16 md:pt-40 md:pb-20 lg:pt-48 lg:pb-24">
      <div className="mx-auto max-w-[var(--max-w-content)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Title — large, confident, type-leading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[clamp(3rem,8vw,7rem)] font-medium leading-none tracking-tight text-foreground"
          >
            {title}
          </motion.h1>

          {/* Description — aligned to top of title on desktop */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="text-2xl font-medium text-muted-foreground lg:pt-[0.15em]"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Metadata — small, quiet, secondary */}
        {hasMeta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            className="mt-12 md:mt-16 pt-6 border-t border-border flex flex-wrap gap-x-12 gap-y-4"
          >
            {client && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Client</p>
                <p className="text-sm font-medium text-foreground">{client}</p>
              </div>
            )}
            {year && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Year</p>
                <p className="text-sm font-medium text-foreground">{year}</p>
              </div>
            )}
            {tags && tags.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Disciplines</p>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium uppercase tracking-wider text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
