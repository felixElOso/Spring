"use client"

import { motion } from "framer-motion"

interface WelcomeSidebarProps {
  onNext: () => void
}

export function WelcomeSidebar({ onNext }: WelcomeSidebarProps) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[36px] font-medium leading-[1.3] text-tofu-100"
        >
          Let&apos;s create your official AI headshot
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="text-base leading-6 text-tofu-120 tracking-tight"
        >
          You&apos;re the heart of the TurboTax human experience. We&apos;ll
          use AI to create a polished, on-brand headshot for your expert
          profile.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col gap-2.5 items-center w-full"
      >
        <button
          onClick={onNext}
          className="w-full h-[42px] bg-tofu-100 text-ink rounded-[4px] font-medium text-base
                     transition-opacity hover:opacity-90 active:translate-y-px"
        >
          Create my AI headshot
        </button>
        <button className="text-base text-tofu-120 underline underline-offset-4 transition-opacity hover:opacity-80">
          I don&apos;t want an AI generated headshot
        </button>
      </motion.div>
    </div>
  )
}
