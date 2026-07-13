'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import { MEDIA_OUTER, MEDIA_SPACING } from '@/components/ui/media'
import type { MediaLayout } from '@/components/ui/media'
import type { MediaStripBlock as MediaStripBlockType, MediaStripItem } from '@/lib/sanity/types'

interface Props {
  block: MediaStripBlockType
}

// Shared height presets. Items keep their natural aspect ratio, so widths vary.
const HEIGHT_MAP: Record<string, string> = {
  small:  'h-[30vh] md:h-[38vh] max-h-[420px]',
  medium: 'h-[45vh] md:h-[55vh] max-h-[640px]',
  large:  'h-[60vh] md:h-[72vh] max-h-[840px]',
}

// Maps the editor's aspect ratio choice to a numeric width/height factor used to
// size videos within the shared height (video elements have no layout-intrinsic
// ratio, so we set width = height * ratio via aspect-ratio CSS).
const ASPECT_CLASS: Record<string, string> = {
  '16/9': 'aspect-[16/9]',
  '4/3':  'aspect-[4/3]',
  '3/2':  'aspect-[3/2]',
  '1/1':  'aspect-square',
  '9/16': 'aspect-[9/16]',
}

// Converts a public Vimeo / YouTube URL into an embed URL (autoplay, muted, loop).
function toEmbedUrl(url: string): string {
  if (url.includes('vimeo.com')) {
    const id = url.split('/').pop()
    return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const id = url.includes('youtu.be') ? url.split('/').pop() : new URL(url).searchParams.get('v')
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&controls=0&playlist=${id}`
  }
  return url
}

function StripItem({ item }: { item: MediaStripItem }) {
  // ── Video ─────────────────────────────────────────────────────────────────
  if (item.mediaType === 'video') {
    const isFile = item.videoType === 'file'
    const fileSrc = item.videoFile?.asset?.url
    const embedSrc = item.videoUrl ? toEmbedUrl(item.videoUrl) : undefined
    const src = isFile ? fileSrc : embedSrc
    if (!src) return null

    // 'Original' sizes an uploaded file by its own intrinsic ratio — same as
    // images in the strip: full height, natural width, nothing cropped.
    // Embeds can't report a ratio from inside an iframe, so they keep 16:9.
    if (item.videoAspect === 'auto' && isFile) {
      return (
        <div className="h-full flex-shrink-0 overflow-hidden rounded-3xl">
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-auto"
          />
        </div>
      )
    }

    const aspect =
      item.videoAspect === 'auto'
        ? ASPECT_CLASS['16/9']
        : ASPECT_CLASS[item.videoAspect ?? '16/9'] ?? ASPECT_CLASS['16/9']

    return (
      <div className={`relative h-full ${aspect} flex-shrink-0 overflow-hidden rounded-3xl`}>
        {isFile ? (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <iframe
            src={src}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={item.altText || 'Video'}
          />
        )}
      </div>
    )
  }

  // ── Image ───────────────────────────────────────────────────────────────────
  if (!item.image) return null
  return (
    <div className="h-full flex-shrink-0 overflow-hidden rounded-sm">
      <Image
        src={urlFor(item.image).height(1440).quality(90).auto('format').fit('max').url()}
        alt={item.altText || ''}
        width={2001}
        height={1440}
        className="h-full w-auto object-cover"
        loading="lazy"
        quality={90}
      />
    </div>
  )
}

export function MediaStripBlock({ block }: Props) {
  const layout = (block.layout as MediaLayout) ?? 'full-bleed'
  const heightClass = HEIGHT_MAP[block.height] ?? HEIGHT_MAP.medium
  const items = block.items ?? []

  if (items.length < 2) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`${MEDIA_OUTER[layout]} ${MEDIA_SPACING[layout]}`}
    >
      {/* Manual horizontal scroll — drag / swipe / trackpad. No auto-scroll.
          Full-bleed strips get a 60px lead-in so the first item doesn't sit
          flush against the viewport edge; other layouts already have padding. */}
      <div
        className={`flex gap-10 overflow-x-auto pb-4 ${heightClass} ${layout === 'full-bleed' ? 'pl-[60px]' : ''}`}
        style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
      >
        {items.map((item, i) => (
          <StripItem key={item._key || i} item={item} />
        ))}
      </div>
    </motion.div>
  )
}
