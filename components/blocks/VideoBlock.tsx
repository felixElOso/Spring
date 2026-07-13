'use client'

import { Media } from '@/components/ui/media'
import type { MediaLayout, MediaRatio } from '@/components/ui/media'
import type { VideoBlock as VideoBlockType } from '@/lib/sanity/types'

interface Props {
  block: VideoBlockType
}

// Converts a public Vimeo / YouTube URL into an embed URL
function toEmbedUrl(url: string, autoplay: boolean): string {
  if (url.includes('vimeo.com')) {
    const id = url.split('/').pop()
    return `https://player.vimeo.com/video/${id}?autoplay=${autoplay ? 1 : 0}&muted=1&loop=1&background=${autoplay ? 1 : 0}`
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const id = url.includes('youtu.be')
      ? url.split('/').pop()
      : new URL(url).searchParams.get('v')
    return `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&mute=1&loop=1`
  }
  return url
}

export function VideoBlock({ block }: Props) {
  const layout = (block.layout as MediaLayout) ?? 'contained'

  // ── File video ────────────────────────────────────────────────────────────
  // Render the uploaded file when Video Type is 'file' OR was never set —
  // older blocks created before the field had a default would otherwise
  // silently render nothing despite having a file attached.
  if (block.file && (block.videoType === 'file' || !block.videoType)) {
    return (
      <Media
        type="video"
        src={block.file.asset.url}
        layout={layout}
        aspectRatio={(block.aspectRatio as MediaRatio) ?? '16/9'}
        caption={block.caption}
        autoplay={block.autoplay}
        loop
        muted
        controls={!block.autoplay}
      />
    )
  }

  // ── Embed video (Vimeo / YouTube) ─────────────────────────────────────────
  if (block.url) {
    return (
      <Media
        type="video"
        src={toEmbedUrl(block.url, block.autoplay)}
        embed
        layout={layout}
        aspectRatio={(block.aspectRatio as MediaRatio) ?? '16/9'}
        caption={block.caption}
      />
    )
  }

  return null
}
