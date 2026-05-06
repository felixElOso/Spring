"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { Headshot } from "../HeadshotFlow"

interface SelectedDisplayProps {
  headshot?: Headshot
}

export function SelectedDisplay({ headshot }: SelectedDisplayProps) {
  if (!headshot) return null

  return (
    <div className="flex items-center justify-center gap-8 p-8 w-full h-full">
      {/* Watermelon background version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-[300px] h-[430px] rounded-[20px] overflow-hidden shadow-[0px_7px_27px_rgba(0,0,0,0.2)] bg-coral/40"
      >
        <Image
          src={headshot.src}
          alt="Selected headshot — watermelon background"
          fill
          className="object-cover"
          sizes="300px"
        />
      </motion.div>

      {/* Tofu background version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="relative w-[300px] h-[430px] rounded-[20px] overflow-hidden shadow-[0px_7px_27px_rgba(0,0,0,0.2)] bg-tofu-100/40"
      >
        <Image
          src={headshot.src}
          alt="Selected headshot — tofu background"
          fill
          className="object-cover"
          sizes="300px"
        />
      </motion.div>
    </div>
  )
}
