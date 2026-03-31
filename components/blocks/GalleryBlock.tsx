'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import { Media, MEDIA_OUTER, MEDIA_SPACING } from '@/components/ui/media'
import type { MediaLayout, MediaRatio } from '@/components/ui/media'
import type { GalleryBlock as GalleryBlockType } from '@/lib/sanity/types'

interface Props {
  block: GalleryBlockType
}

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: GalleryBlockType['images']
  startIndex: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(startIndex)
  const img = images[current]

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative max-w-5xl w-full mx-8"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={urlFor(img.image).width(1600).auto('format').url()}
          alt={img.altText || ''}
          width={1600}
          height={900}
          className="w-full h-auto"
        />
        {img.caption && (
          <p className="mt-3 text-sm text-white/60 text-center">{img.caption}</p>
        )}
        <div className="absolute top-4 right-4 flex gap-4">
          {current > 0 && (
            <button onClick={() => setCurrent(c => c - 1)} className="text-white/60 hover:text-white text-sm">← Prev</button>
          )}
          {current < images.length - 1 && (
            <button onClick={() => setCurrent(c => c + 1)} className="text-white/60 hover:text-white text-sm">Next →</button>
          )}
          <button onClick={onClose} className="text-white/60 hover:text-white text-sm">Close</button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

export function GalleryBlock({ block }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const layout = (block.layout as MediaLayout) ?? 'full-width'

  const gridClass = {
    1: 'grid grid-cols-1',
    2: 'grid grid-cols-2 gap-4',
    3: 'grid-gallery-3',
    4: 'grid-gallery-4',
  }[block.columns] || 'grid grid-cols-2 gap-4'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`${MEDIA_OUTER[layout]} ${MEDIA_SPACING[layout]}`}
    >
      <div className={gridClass}>
        {block.images?.map((item, i) => (
          <div
            key={item._key || i}
            className={block.enableLightbox ? 'cursor-pointer' : ''}
            onClick={() => block.enableLightbox && setLightboxIndex(i)}
          >
            <Media
              type="image"
              src={urlFor(item.image).width(800).auto('format').url()}
              alt={item.altText || ''}
              layout="thumbnail"
              aspectRatio={(block.aspectRatio as MediaRatio) ?? '4/3'}
              caption={item.caption}
              animate={false}
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={block.images}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
