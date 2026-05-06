import type { Metadata } from "next"
import { HeadshotFlow } from "@/components/headshot/HeadshotFlow"

export const metadata: Metadata = {
  title: "Upload Photos",
  description: "Upload your photos for Portrait Pal.",
}

export default function UploadPage() {
  return <HeadshotFlow />
}
