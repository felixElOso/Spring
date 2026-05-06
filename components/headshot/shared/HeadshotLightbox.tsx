"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"
import type { Headshot } from "../HeadshotFlow"

interface HeadshotLightboxProps {
  headshot?: Headshot
  onSelect: () => void
  onClose: () => void
}

export function HeadshotLightbox({
  headshot,
  onSelect,
  onClose,
}: HeadshotLightboxProps) {
  if (!headshot) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-tofu-100 hover:text-white transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Large headshot */}
        <div className="relative w-[342px] h-[490px] rounded-[20px] overflow-hidden shadow-[0px_7px_27px_rgba(0,0,0,0.2)] bg-coral/40">
          <Image
            src={headshot.src}
            alt="Selected headshot preview"
            fill
            className="object-cover"
            sizes="342px"
          />
        </div>

        {/* Select button */}
        <button
          onClick={onSelect}
          className="h-[42px] px-8 bg-tofu-100 text-ink rounded-[4px] font-medium text-base
                     transition-opacity hover:opacity-90 active:translate-y-px"
        >
          Select headshot
        </button>
      </motion.div>
    </motion.div>
  )
}
