"use client"

import { motion } from "framer-motion"

export function SelectionSidebar() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[36px] font-medium leading-[1.3] text-tofu-100"
        >
          Choose your favorite headshot
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="text-base leading-6 text-tofu-120"
        >
          Select the headshot you like most. We&apos;ll create a version with a
          watermelon and tofu background. You&apos;ll also be able to download
          the image and the album.
        </motion.p>
      </div>
    </div>
  )
}
