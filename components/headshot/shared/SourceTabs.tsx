"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Tab = "computer" | "phone" | "camera"

interface SourceTabsProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string }[] = [
  { id: "computer", label: "Computer" },
  { id: "phone", label: "Phone" },
  { id: "camera", label: "Camera" },
]

export function SourceTabs({ activeTab, onTabChange }: SourceTabsProps) {
  return (
    <div className="flex items-center w-full bg-pepper-110 rounded-full p-0.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative flex-1 flex items-center justify-center py-2.5 px-6 rounded-full text-base font-medium transition-colors",
            activeTab === tab.id ? "text-white" : "text-pepper-40 hover:text-pepper-20"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="source-tab-bg"
              className="absolute inset-0 bg-pepper-130 rounded-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
