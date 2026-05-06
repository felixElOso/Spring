"use client"

import { motion } from "framer-motion"

interface GeneratingGridProps {
  progress: number
}

export function GeneratingGrid({ progress }: GeneratingGridProps) {
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-3 p-8 w-full h-full">
      {Array.from({ length: 12 }).map((_, i) => {
        // Gradually reveal cells based on progress
        const cellThreshold = ((i + 1) / 12) * 100
        const isRevealing = progress >= cellThreshold - 15
        const brightness = isRevealing
          ? 0.35 + (progress / 100) * 0.15
          : 0.25 + (i % 3) * 0.05

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              backgroundColor: `hsl(210, 8%, ${brightness * 100}%)`,
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.05,
              backgroundColor: { duration: 1.5, ease: "easeInOut" },
            }}
            className="rounded-[10px]"
          />
        )
      })}
    </div>
  )
}
