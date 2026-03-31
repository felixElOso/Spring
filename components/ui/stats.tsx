"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Stat {
  value: string
  label: string
}

interface StatsProps {
  items: Stat[]
  columns?: 2 | 3 | 4
  className?: string
}

const colsMap = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
} as const

export function Stats({ items, columns = 3, className }: StatsProps) {
  return (
    <div className={cn("grid gap-8 md:gap-12", colsMap[columns], className)}>
      {items.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
        >
          <div className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
            {stat.value}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
