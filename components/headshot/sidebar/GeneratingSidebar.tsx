"use client"

import { motion } from "framer-motion"

interface GeneratingSidebarProps {
  progress: number
}

export function GeneratingSidebar({ progress }: GeneratingSidebarProps) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[36px] font-medium leading-[1.3] text-tofu-100"
        >
          Generating headshot
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="text-base leading-6 text-tofu-120"
        >
          Hang tight, your AI generated headshots are on the way.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-coral text-base font-medium"
      >
        {progress}%
      </motion.div>
    </div>
  )
}
