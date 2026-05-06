"use client"

import { motion } from "framer-motion"
import { Trash2, CircleCheck, CircleX, CircleHelp } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { UploadedFile } from "../HeadshotFlow"

interface FileRowProps {
  file: UploadedFile
  onRemove: (id: string) => void
  onOpenGuidelines?: () => void
}

export function FileRow({ file, onRemove, onOpenGuidelines }: FileRowProps) {
  const isError = file.status === "error"
  const isValidating = file.status === "validating"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex flex-col gap-2 p-2 rounded-xl",
        isError ? "bg-[#2a2121]" : "bg-pepper-120"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[30px]">
          {/* Thumbnail */}
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-pepper-80 shrink-0">
            <Image
              src={file.thumbnailSrc}
              alt={file.name}
              fill
              className="object-cover"
              sizes="48px"
            />
            {/* Status badge */}
            <div className="absolute -top-1 -right-1">
              {file.status === "valid" && (
                <CircleCheck className="w-4 h-4 text-spearmint-60 fill-white" />
              )}
              {isError && (
                <CircleX className="w-4 h-4 text-watermelon-50 fill-white" />
              )}
              {isValidating && (
                <div className="w-4 h-4 rounded-full bg-pepper-60 animate-pulse" />
              )}
            </div>
          </div>

          {/* Filename */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "text-base font-medium",
                isError ? "text-coral" : "text-pepper-40"
              )}
            >
              {file.name}
            </span>
            {isError && (
              <CircleHelp className="w-5 h-5 text-coral" strokeWidth={1.5} />
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(file.id)
          }}
          className="text-pepper-40 hover:text-tofu-100 transition-colors p-1"
        >
          <Trash2 className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Error message */}
      {isError && file.errorMessage && (
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <p className="text-sm leading-5 text-tofu-120">
            {file.errorMessage}{" "}
            {onOpenGuidelines && (
              <>
                Review photo the{" "}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenGuidelines()
                  }}
                  className="text-coral underline underline-offset-2"
                >
                  guidelines
                </button>{" "}
                to upload a better photo.
              </>
            )}
          </p>
        </div>
      )}
    </motion.div>
  )
}
