"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface GuidelinesModalProps {
  onClose: () => void
}

const DONTS = [
  { label: "No hands in shot", icon: "hands" },
  { label: "No hats or headgear", icon: "hat" },
  { label: "No Sunglasses", icon: "sunglasses" },
  { label: "No face covering", icon: "mask" },
]

// Simple icon SVGs for the guidelines
function GuidelineIcon({ type }: { type: string }) {
  const iconClass = "w-12 h-12 text-pepper-40 stroke-[1.2]"

  switch (type) {
    case "hands":
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <path d="M12 28c-2-4-3-8-2-12 1-3 3-4 5-3s3 4 2 8M18 21c-1-4 0-9 2-11s4-1 5 2 0 8-1 11M26 22c0-4 1-9 3-10s4 0 4 3-1 8-2 10M33 24c1-3 2-7 4-8s3 0 3 3-2 8-4 11M15 30c2 4 6 8 10 10M25 40c3-1 7-4 9-8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "hat":
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <ellipse cx="24" cy="32" rx="16" ry="4" strokeLinecap="round" />
          <path d="M12 32c0-6 2-14 12-14s12 8 12 14" strokeLinecap="round" />
          <path d="M8 32h32" strokeLinecap="round" />
          <path d="M16 18c2-4 5-6 8-6s6 2 8 6" strokeLinecap="round" />
        </svg>
      )
    case "sunglasses":
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <path d="M6 22h36" strokeLinecap="round" />
          <rect x="8" y="22" width="12" height="8" rx="4" />
          <rect x="28" y="22" width="12" height="8" rx="4" />
          <path d="M20 26h8" strokeLinecap="round" />
          <path d="M6 22l2-2M42 22l-2-2" strokeLinecap="round" />
        </svg>
      )
    case "mask":
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <path d="M10 20c0 0 2-2 14-2s14 2 14 2v8c0 6-6 10-14 10S10 34 10 28z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 28h16" strokeLinecap="round" />
          <path d="M10 20l-4-2M38 20l4-2" strokeLinecap="round" />
          <path d="M18 24v2M30 24v2" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

export function GuidelinesModal({ onClose }: GuidelinesModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative max-w-3xl w-full mx-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-tofu-100 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center mb-10">
          <h2 className="text-[36px] font-medium text-tofu-100 leading-[1.3]">
            Avoid photos that block your face
          </h2>
          <p className="text-base text-pepper-40 mt-1">
            Here some don&apos;t do&apos;s below
          </p>
        </div>

        {/* Icon cards */}
        <div className="grid grid-cols-4 gap-5">
          {DONTS.map((item) => (
            <div
              key={item.label}
              className="relative bg-pepper-100 rounded-2xl p-6 flex flex-col items-center gap-4"
            >
              {/* Coral X badge */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-coral rounded-full flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>

              <GuidelineIcon type={item.icon} />
              <p className="text-base text-tofu-100 text-center font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
