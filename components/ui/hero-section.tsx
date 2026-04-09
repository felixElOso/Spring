"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export function HeroSection({
  title,
  subtitle,
  children,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "section-pad pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-32",
        className
      )}
    >
      <div className="mx-auto max-w-[var(--max-w-content)]">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-foreground"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="mt-6 max-w-2xl text-lg md:text-xl lg:text-2xl text-muted-foreground leading-7"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            className="mt-10"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}
