'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import { MEDIA_OUTER, MEDIA_SPACING } from '@/components/ui/media'
import type { MediaLayout } from '@/components/ui/media'
import type { MarqueeGalleryBlock as MarqueeGalleryBlockType } from '@/lib/sanity/types'
import type { MarqueeGalleryImage } from '@/lib/sanity/types'

interface Props {
  block: MarqueeGalleryBlockType
}

const SPEED_MAP = {
  slow: 60,
  medium: 35,
  fast: 20,
}

function FlipCard({ img }: { img: MarqueeGalleryImage }) {
  const hasCompanion = !!img.companionImage

  return (
    <div
      className="flex-shrink-0 h-48 md:h-64 lg:h-72 rounded-sm"
      style={{ perspective: '1000px' }}
    >
      <div
        className={`relative h-full transition-transform duration-500 ease-out ${hasCompanion ? 'hover:[transform:rotateY(180deg)]' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="h-full overflow-hidden rounded-sm"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src={urlFor(img.image).height(576).quality(90).auto('format').fit('max').url()}
            alt={img.altText || ''}
            width={800}
            height={576}
            className="h-full w-auto object-cover"
            loading="lazy"
            quality={90}
          />
        </div>

        {/* Back */}
        {hasCompanion && (
          <div
            className="absolute inset-0 h-full overflow-hidden rounded-sm"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <Image
              src={urlFor(img.companionImage!).height(576).quality(90).auto('format').fit('max').url()}
              alt={img.altText ? `${img.altText} (companion)` : ''}
              width={800}
              height={576}
              className="h-full w-auto object-cover"
              loading="lazy"
              quality={90}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function MarqueeGalleryBlock({ block }: Props) {
  const layout = (block.layout as MediaLayout) ?? 'full-bleed'
  const baseSpeed = SPEED_MAP[block.speed] ?? 35

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`${MEDIA_OUTER[layout]} ${MEDIA_SPACING[layout]}`}
    >
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-scroll-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <div className="flex flex-col gap-4">
        {block.rows?.map((row, rowIndex) => {
          const imageCount = row.images?.length || 1
          const duration = baseSpeed * (imageCount / 5)
          const isReverse = rowIndex % 2 === 1
          const animationName = isReverse ? 'marquee-scroll-reverse' : 'marquee-scroll'

          return (
            <div
              key={row._key || rowIndex}
              className="overflow-hidden"
            >
              <div
                className={`flex gap-4 w-max will-change-transform ${block.pauseOnHover ? '[&:hover]:[animation-play-state:paused]' : ''}`}
                style={{
                  animation: `${animationName} ${duration}s linear infinite`,
                }}
              >
                {/* Render images twice for seamless loop */}
                {[0, 1].map((pass) =>
                  row.images?.map((img, imgIndex) => (
                    <FlipCard
                      key={`${pass}-${img._key || imgIndex}`}
                      img={img}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
