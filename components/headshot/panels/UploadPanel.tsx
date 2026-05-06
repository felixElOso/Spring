"use client"

import { useState } from "react"
import type { UploadedFile } from "../HeadshotFlow"
import { SourceTabs } from "../shared/SourceTabs"
import { DropZone } from "../shared/DropZone"
import { FileList } from "../shared/FileList"

interface UploadPanelProps {
  files: UploadedFile[]
  maxPhotos: number
  onAddFiles: (files: File[]) => void
  onRemoveFile: (id: string) => void
}

export function UploadPanel({
  files,
  maxPhotos,
  onAddFiles,
  onRemoveFile,
}: UploadPanelProps) {
  const [activeTab, setActiveTab] = useState<"computer" | "phone" | "camera">(
    "computer"
  )

  return (
    <div className="flex flex-col items-center gap-5 w-[660px] max-w-full px-8">
      <SourceTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "computer" && (
        <DropZone
          onFiles={onAddFiles}
          disabled={files.length >= maxPhotos}
          hasFiles={files.length > 0}
        >
          {files.length > 0 && (
            <FileList files={files} onRemove={onRemoveFile} />
          )}
        </DropZone>
      )}

      {activeTab === "phone" && (
        <div className="w-full h-[424px] bg-pepper-130 border border-dashed border-tofu-100/40 rounded-[30px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-[160px] h-[160px] bg-white rounded-lg p-3">
              <div className="w-full h-full bg-pepper-120 rounded" />
            </div>
            <p className="text-sm text-pepper-40">Instructions go here</p>
          </div>
        </div>
      )}

      {activeTab === "camera" && (
        <div className="w-full h-[424px] bg-pepper-130 border border-dashed border-tofu-100/40 rounded-[30px] flex items-center justify-center">
          <p className="text-sm text-pepper-40">Camera capture coming soon</p>
        </div>
      )}
    </div>
  )
}
