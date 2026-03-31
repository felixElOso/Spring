'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── Public types ─────────────────────────────────────────────────────────────

export type MediaType   = 'image' | 'video' | 'animation'
export type MediaLayout = 'full-bleed' | 'full-width' | 'contained' | 'thumbnail'
export type MediaRatio  = '16/9' | '4/3' | '1/1' | '3/2' | '21/9' | '9/16'

export interface MediaProps {
  // ── Content ────────────────────────────────────────────
  type?:      MediaType
  src?:       string           // image URL, video file URL, or iframe embed URL
  embed?:     boolean          // if true + type='video', renders an <iframe>
  alt?:       string
  caption?:   string
  poster?:    string           // video poster frame
  children?:  React.ReactNode  // animation player slot

  // ── Layout & shape ─────────────────────────────────────
  layout?:      MediaLayout
  aspectRatio?: MediaRatio

  // ── Image ──────────────────────────────────────────────
  priority?: boolean
  sizes?:    string

  // ── Video ──────────────────────────────────────────────
  autoplay?: boolean
  loop?:     boolean
  muted?:    boolean
  controls?: boolean

  // ── Misc ───────────────────────────────────────────────
  animate?:      boolean
  className?:    string
  style?:        React.CSSProperties
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
}

// ─── Layout token maps ────────────────────────────────────────────────────────
//
// outer  — width / centering / horizontal padding
// spacing — vertical padding applied to the <figure> itself

export const MEDIA_OUTER: Record<MediaLayout, string> = {
  'full-bleed': 'w-full',
  'full-width': 'max-w-content mx-auto section-pad',
  'contained':  'max-w-3xl mx-auto px-6 md:px-12 lg:px-24',
  'thumbnail':  '',
}

export const MEDIA_SPACING: Record<MediaLayout, string> = {
  'full-bleed': '',
  'full-width': 'py-8 md:py-16',
  'contained':  'py-8 md:py-12',
  'thumbnail':  '',
}

// ─── Aspect-ratio token map ───────────────────────────────────────────────────

export const MEDIA_RATIO: Record<MediaRatio, string> = {
  '16/9': 'aspect-video',
  '4/3':  'aspect-[4/3]',
  '1/1':  'aspect-square',
  '3/2':  'aspect-[3/2]',
  '21/9': 'aspect-[21/9]',
  '9/16': 'aspect-[9/16]',
}

function defaultSizes(layout: MediaLayout): string {
  switch (layout) {
    case 'thumbnail': return '(max-width: 640px) 50vw, 25vw'
    case 'contained': return '(max-width: 768px) 100vw, 48rem'
    default:          return '100vw'
  }
}

// ─── Placeholder icons (shown when no src / children) ─────────────────────────

function PlaceholderIcon({ type }: { type: MediaType }) {
  if (type === 'video') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        className="text-foreground/20"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    )
  }
  if (type === 'animation') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        className="text-foreground/20"
      >
        <path d="M12 3v3M12 18v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M3 12h3M18 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    )
  }
  // image (default)
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="text-foreground/20"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}

// ─── Media ────────────────────────────────────────────────────────────────────

export function Media({
  type        = 'image',
  src,
  embed       = false,
  alt         = '',
  caption,
  poster,
  children,
  layout      = 'contained',
  aspectRatio = '16/9',
  priority    = false,
  sizes,
  autoplay    = false,
  loop        = true,
  muted       = true,
  controls    = true,
  animate     = true,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
}: MediaProps) {

  const hasContent =
    (type === 'image' && !!src) ||
    (type === 'video' && !!src) ||
    !!children

  const figureProps = {
    className: cn(MEDIA_OUTER[layout], MEDIA_SPACING[layout], className),
    style,
    onMouseEnter,
    onMouseLeave,
  }

  const motionProps = animate
    ? {
        initial:    { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport:   { once: true, margin: '-60px' },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {}

  const content = (
    <>
      {/* ── Media surface ─────────────────────────────────── */}
      <div className={cn('relative w-full overflow-hidden bg-muted', MEDIA_RATIO[aspectRatio])}>

        {/* Image */}
        {type === 'image' && src && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={sizes ?? defaultSizes(layout)}
            priority={priority}
          />
        )}

        {/* Video — file */}
        {type === 'video' && src && !embed && (
          <video
            src={src}
            poster={poster}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            playsInline
            controls={controls && !autoplay}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Video — iframe embed (Vimeo / YouTube) */}
        {type === 'video' && src && embed && (
          <iframe
            src={src}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={alt || 'Video'}
          />
        )}

        {/* Children — animation player (centered) or arbitrary overlay (fill) */}
        {children && (
          <div className={cn(
            'absolute inset-0',
            type === 'animation' && 'flex items-center justify-center'
          )}>
            {children}
          </div>
        )}

        {/* Placeholder — shown when no content is provided */}
        {!hasContent && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <PlaceholderIcon type={type} />
            <span className="text-[10px] font-mono text-foreground/25 uppercase tracking-widest">
              {type}
            </span>
          </div>
        )}

      </div>

      {/* ── Caption ───────────────────────────────────────── */}
      {caption && (
        <figcaption className="mt-3 text-sm text-foreground/50">
          {caption}
        </figcaption>
      )}
    </>
  )

  // Use motion.figure for animated, plain figure for static
  if (animate) {
    return (
      <motion.figure {...figureProps} {...motionProps}>
        {content}
      </motion.figure>
    )
  }

  return (
    <figure {...figureProps}>
      {content}
    </figure>
  )
}
