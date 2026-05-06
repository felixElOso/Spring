"use client"

import { motion } from "framer-motion"

interface CompleteSidebarProps {
  onFinish: () => void
  onBack: () => void
}

export function CompleteSidebar({ onFinish, onBack }: CompleteSidebarProps) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[36px] font-medium leading-[1.3] text-tofu-100"
        >
          Headshot selected!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="text-base leading-6 text-tofu-120"
        >
          We&apos;ve got your headshot! You can download the image and the
          album.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col gap-2 w-full"
      >
        <button
          onClick={onFinish}
          className="w-full h-[42px] bg-tofu-100 text-ink rounded-[4px] font-medium text-base
                     transition-opacity hover:opacity-90 active:translate-y-px"
        >
          Finish
        </button>
        <button
          className="w-full h-[42px] border-2 border-tofu-100 text-tofu-100 rounded-[4px]
                     font-medium text-base transition-opacity hover:opacity-80"
        >
          Download album
        </button>
        <button
          onClick={onBack}
          className="w-full h-[42px] text-tofu-100 font-medium text-base
                     transition-opacity hover:opacity-80"
        >
          Back
        </button>
      </motion.div>
    </div>
  )
}
