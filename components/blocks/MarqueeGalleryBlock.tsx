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
    // perspective controls how far the flip's near edge projects past the
    // card's own box. At 1000px a tall card overhangs by up to ~500px, which
    // the row's horizontal clip then shears off. 4000px keeps a real sense of
    // depth while holding the worst case to ~65px, inside the row's padding.
    <div
      className="flex-shrink-0 h-[45vh] md:h-[55vh] xl:h-[70vh] max-h-[800px] rounded-media"
      style={{ perspective: '4000px' }}
    >
      <div
        className={`relative h-full transition-transform duration-500 ease-out ${hasCompanion ? 'hover:[transform:rotateY(180deg)]' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="h-full overflow-hidden rounded-media"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src={urlFor(img.image).height(1440).quality(90).auto('format').fit('max').url()}
            alt={img.altText || ''}
            width={2001}
            height={1440}
            className="h-full w-auto object-cover"
            loading="lazy"
            quality={90}
          />
        </div>

        {/* Back */}
        {hasCompanion && (
          <div
            className="absolute inset-0 h-full overflow-hidden rounded-media"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <Image
              src={urlFor(img.companionImage!).height(1440).quality(90).auto('format').fit('max').url()}
              alt={img.altText ? `${img.altText} (companion)` : ''}
              width={2001}
              height={1440}
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

      <div className="flex flex-col gap-10">
        {block.rows?.map((row, rowIndex) => {
          const imageCount = row.images?.length || 1
          const duration = baseSpeed * (imageCount / 5)
          const isReverse = rowIndex % 2 === 1
          const animationName = isReverse ? 'marquee-scroll-reverse' : 'marquee-scroll'

          return (
            // The row must clip horizontally so the duplicated marquee track
            // doesn't spill across the page. But a card mid-flip rotates in 3D
            // and its near edge projects well past the card's flat box, so a
            // tight clip shears the flip. CSS can't hide one axis and show the
            // other (hidden on one forces auto on the other), so we push the
            // clip boundary away with vertical padding and cancel the added
            // height with an equal negative margin — the flip stays whole and
            // surrounding layout is untouched.
            //
            // Sizing: worst-case overhang is at rotateY(90deg) and grows with
            // card height. With the card's 4000px perspective that peaks at
            // ~65px for the tallest (800px) card, so py-24 (96px) clears every
            // breakpoint with room to spare.
            <div
              key={row._key || rowIndex}
              className="overflow-hidden py-24 -my-24"
            >
              <div
                className={`flex gap-10 w-max will-change-transform ${block.pauseOnHover ? '[&:hover]:[animation-play-state:paused]' : ''}`}
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
