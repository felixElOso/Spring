"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { Headshot } from "../HeadshotFlow"

interface HeadshotGridProps {
  headshots: Headshot[]
  onSelect: (id: string) => void
}

export function HeadshotGrid({ headshots, onSelect }: HeadshotGridProps) {
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-3 p-8 w-full h-full">
      {headshots.map((headshot, i) => (
        <motion.button
          key={headshot.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
          onClick={() => onSelect(headshot.id)}
          className="relative overflow-hidden rounded-[10px] bg-coral/30 cursor-pointer
                     transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Image
            src={headshot.src}
            alt="AI generated headshot"
            fill
            className="object-cover"
            sizes="200px"
          />
        </motion.button>
      ))}
    </div>
  )
}
