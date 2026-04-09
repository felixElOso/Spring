"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextBlockProps {
  children: React.ReactNode
  size?: "base" | "lg"
  className?: string
}

export function TextBlock({ children, size = "base", className }: TextBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "max-w-3xl text-muted-foreground",
        size === "base" && "text-base md:text-lg leading-relaxed",
        size === "lg" && "text-lg md:text-xl lg:text-2xl leading-7",
        className
      )}
    >
      {children}
    </motion.div>
  )
}
