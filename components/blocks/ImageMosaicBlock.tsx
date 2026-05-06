'use client'

import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { Media, MEDIA_OUTER, MEDIA_SPACING } from '@/components/ui/media'
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider'
import type { MediaLayout } from '@/components/ui/media'
import type { ImageMosaicBlock as ImageMosaicBlockType, ImageMosaicImage } from '@/lib/sanity/types'

interface Props {
  block: ImageMosaicBlockType
}

function MosaicItem({ item, width, rounded, sizes, fillHeight }: { item: ImageMosaicImage; width: number; rounded?: boolean; sizes?: string; fillHeight?: boolean }) {
  const isBeforeAfter = item.mediaType === 'beforeAfter' && item.beforeImage && item.afterImage

  if (isBeforeAfter) {
    const beforeUrl = urlFor(item.beforeImage!).width(width).quality(90).auto('format').fit('max').url()
    const afterUrl = urlFor(item.afterImage!).width(width).quality(90).auto('format').fit('max').url()

    return (
      <div className={`${rounded ? 'overflow-hidden rounded-3xl' : ''} ${fillHeight ? 'h-full' : ''}`}>
        <BeforeAfterSlider
          beforeUrl={beforeUrl}
          afterUrl={afterUrl}
          beforeLabel={item.beforeLabel || 'Before'}
          afterLabel={item.afterLabel || 'After'}
          fillHeight={fillHeight}
        />
        {item.caption && (
          <p className="mt-3 text-sm text-foreground/50">{item.caption}</p>
        )}
      </div>
    )
  }

  return (
    <div className={rounded ? 'overflow-hidden rounded-3xl' : ''}>
      <Media
        type="image"
        src={urlFor(item.image).width(width).quality(90).auto('format').fit('max').url()}
        alt={item.altText || ''}
        layout="thumbnail"
        aspectRatio={item.size === 'large' ? '3/2' : '4/3'}
        caption={item.caption}
        sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'}
        animate={false}
      />
    </div>
  )
}

function SideBySideLayout({ images, rounded }: { images: ImageMosaicImage[]; rounded: boolean }) {
  // Split images into groups: consecutive smalls get stacked together
  const groups: ImageMosaicImage[][] = []
  for (const img of images) {
    const last = groups[groups.length - 1]
    if (img.size === 'small' && last && last[0].size === 'small') {
      last.push(img)
    } else {
      groups.push([img])
    }
  }

  const allLarge = groups.every((g) => g[0].size === 'large')
  const allSmall = groups.every((g) => g[0].size === 'small')
  const even = allLarge || allSmall

  // Check if any group has stacked items (meaning a large item should stretch to match)
  const hasStackedGroup = groups.some((g) => g.length > 1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {groups.map((group, i) => {
        const isLarge = group[0].size === 'large'
        const span = even ? 'md:col-span-6' : isLarge ? 'md:col-span-7' : 'md:col-span-5'

        if (group.length === 1) {
          // Large single items stretch to match stacked small items beside them
          const shouldFillHeight = isLarge && hasStackedGroup
          return (
            <div key={group[0]._key || i} className={span}>
              <MosaicItem item={group[0]} width={isLarge ? 2400 : 1600} rounded={rounded} fillHeight={shouldFillHeight} />
            </div>
          )
        }

        return (
          <div key={group[0]._key || i} className={`${span} flex flex-col gap-4`}>
            {group.map((item, j) => (
              <MosaicItem key={item._key || j} item={item} width={1600} rounded={rounded} />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function FeatureLayout({ images, rounded }: { images: ImageMosaicImage[]; rounded: boolean }) {
  const [feature, ...rest] = images

  return (
    <div className="flex flex-col gap-4">
      {/* Large feature image on top */}
      <div>
        <MosaicItem item={feature} width={2400} rounded={rounded} sizes="100vw" />
      </div>

      {/* Smaller images below in a row */}
      {rest.length > 0 && (
        <div className={`grid grid-cols-1 gap-4 ${
          rest.length === 1 ? 'md:grid-cols-1' :
          rest.length === 2 ? 'md:grid-cols-2' :
          'md:grid-cols-3'
        }`}>
          {rest.map((item, i) => (
            <MosaicItem key={item._key || i} item={item} width={1600} rounded={rounded} />
          ))}
        </div>
      )}
    </div>
  )
}

export function ImageMosaicBlock({ block }: Props) {
  const layout = (block.layout as MediaLayout) ?? 'full-width'
  const images = block.images ?? []
  const mosaicStyle = block.mosaicStyle ?? 'side-by-side'
  const rounded = layout !== 'full-bleed'

  if (images.length < 2) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className={`${MEDIA_OUTER[layout]} ${MEDIA_SPACING[layout]}`}
    >
      {mosaicStyle === 'feature' ? (
        <FeatureLayout images={images} rounded={rounded} />
      ) : (
        <SideBySideLayout images={images} rounded={rounded} />
      )}
    </motion.div>
  )
}
