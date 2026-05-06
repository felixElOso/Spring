"use client"

import { ReactNode } from "react"
import { StepIndicator } from "./StepIndicator"

interface SplitLayoutProps {
  leftContent: ReactNode
  rightContent: ReactNode
  currentStep: number
  totalSteps: number
}

export function SplitLayout({
  leftContent,
  rightContent,
  currentStep,
  totalSteps,
}: SplitLayoutProps) {
  return (
    <div className="h-screen w-full flex bg-pepper-130 overflow-hidden">
      {/* Left panel — media/content */}
      <div className="relative w-[62%] bg-pepper-120 flex items-center justify-center">
        {leftContent}
      </div>

      {/* Right panel — sidebar */}
      <div className="relative flex-1 flex items-center px-16">
        <div className="w-[330px]">{rightContent}</div>

        {/* Step indicator on far-right edge */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>
    </div>
  )
}
