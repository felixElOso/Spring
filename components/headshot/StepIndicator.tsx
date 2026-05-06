"use client"

import { motion } from "framer-motion"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <motion.div
          key={i}
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={
            i === currentStep
              ? "w-1.5 h-4 rounded-full bg-coral"
              : "w-1.5 h-1.5 rounded-full bg-coral opacity-20"
          }
        />
      ))}
    </div>
  )
}
