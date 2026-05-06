"use client"

import { useState, useRef, ReactNode } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropZoneProps {
  onFiles: (files: File[]) => void
  disabled?: boolean
  hasFiles?: boolean
  children?: ReactNode
}

export function DropZone({ onFiles, disabled, hasFiles, children }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const files = Array.from(e.dataTransfer.files)
    onFiles(files)
  }

  function handleClick() {
    if (!disabled) inputRef.current?.click()
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    onFiles(files)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={cn(
        "relative w-full bg-pepper-130 border border-dashed rounded-[30px] overflow-hidden cursor-pointer transition-colors",
        isDragging ? "border-coral bg-coral/5" : "border-tofu-100/40",
        disabled && "opacity-50 pointer-events-none",
        hasFiles ? "min-h-[424px]" : "h-[424px]"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      {/* File list */}
      {children && (
        <div className="p-5 pb-0">
          {children}
        </div>
      )}

      {/* Drop prompt */}
      <div className={cn(
        "flex flex-col items-center gap-1",
        hasFiles
          ? "py-8"
          : "absolute inset-0 items-center justify-center"
      )}>
        <Upload className="w-6 h-6 text-pepper-40" strokeWidth={1.5} />
        <p className="text-sm text-pepper-40 text-center">
          Drop photo here or browse
        </p>
      </div>
    </div>
  )
}
