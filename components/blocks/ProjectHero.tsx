"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { flattenTitle } from "@/lib/utils"

interface ProjectHeroProps {
  title: string
  /** Cover still — already resolved to a URL via urlFor() */
  coverUrl?: string | null
  /** Cover video — autoplaying loop, takes precedence over coverUrl */
  coverVideoUrl?: string | null
  challenge?: string
  solution?: string
}

export function ProjectHero({
  title,
  coverUrl,
  coverVideoUrl,
  challenge,
  solution,
}: ProjectHeroProps) {
  const hasMedia = Boolean(coverVideoUrl || coverUrl)
  const hasCopy = Boolean(challenge || solution)

  return (
    <section className="section-pad pt-28 pb-20 md:pt-32 md:pb-28 lg:pt-36 lg:pb-32">
      <div className="mx-auto flex max-w-[var(--max-w-content)] flex-col gap-16 md:gap-20 lg:gap-[100px]">
        {/* Cover media — rounded panel at the top */}
        {hasMedia && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-full overflow-hidden rounded-3xl bg-muted"
            style={{ aspectRatio: "1320 / 744" }}
          >
            {coverVideoUrl ? (
              <video
                src={coverVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : coverUrl ? (
              <Image
                src={coverUrl}
                alt={flattenTitle(title)}
                fill
                sizes="(min-width: 1400px) 1320px, 100vw"
                className="object-cover"
                priority
                unoptimized
              />
            ) : null}
          </motion.div>
        )}

        {/* Title — oversized, type-leading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="whitespace-pre-line text-[clamp(3.25rem,10vw,9.375rem)] font-medium leading-none tracking-[-0.03em] text-foreground"
        >
          {title}
        </motion.h1>

        {/* Challenge / Solution — two equal columns */}
        {hasCopy && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
            className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-6"
          >
            {challenge && (
              <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-medium text-foreground">Challenge</h2>
                <p className="whitespace-pre-line text-lg leading-relaxed tracking-[-0.01em] text-muted-foreground md:text-xl">
                  {challenge}
                </p>
              </div>
            )}
            {solution && (
              <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-medium text-foreground">Solution</h2>
                <p className="whitespace-pre-line text-lg leading-relaxed tracking-[-0.01em] text-muted-foreground md:text-xl">
                  {solution}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
