"use client"

import { motion } from "framer-motion"

interface UploadSidebarProps {
  fileCount: number
  hasValidFiles: boolean
  onSubmit: () => void
  onBack: () => void
  onOpenGuidelines: () => void
}

export function UploadSidebar({
  fileCount,
  hasValidFiles,
  onSubmit,
  onBack,
  onOpenGuidelines,
}: UploadSidebarProps) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[36px] font-medium leading-[1.3] text-tofu-100"
        >
          Add your photos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="text-base leading-6 text-tofu-120"
        >
          Add up to <strong className="font-medium text-tofu-100">6 photos</strong>{" "}
          of yourself to get the best results. Follow the{" "}
          <button
            onClick={onOpenGuidelines}
            className="text-coral underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            guidelines
          </button>{" "}
          when choosing your photos.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col gap-2 items-start"
      >
        <button
          onClick={onSubmit}
          disabled={!hasValidFiles}
          className="w-[330px] h-[42px] bg-tofu-100 text-ink rounded-[4px] font-medium text-base
                     transition-opacity hover:opacity-90 active:translate-y-px
                     disabled:opacity-40 disabled:pointer-events-none"
        >
          Submit
        </button>
        <button
          onClick={onBack}
          className="w-[330px] h-[42px] text-tofu-100 font-medium text-base
                     transition-opacity hover:opacity-80"
        >
          Back
        </button>
      </motion.div>
    </div>
  )
}
