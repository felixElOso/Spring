"use client"

import { AnimatePresence } from "framer-motion"
import type { UploadedFile } from "../HeadshotFlow"
import { FileRow } from "./FileRow"

interface FileListProps {
  files: UploadedFile[]
  onRemove: (id: string) => void
  onOpenGuidelines?: () => void
}

export function FileList({ files, onRemove, onOpenGuidelines }: FileListProps) {
  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {files.map((file) => (
          <FileRow
            key={file.id}
            file={file}
            onRemove={onRemove}
            onOpenGuidelines={onOpenGuidelines}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
