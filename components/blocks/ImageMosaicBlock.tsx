'use client'

import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { Media, MEDIA_OUTER, MEDIA_SPACING } from '@/components/ui/media'
import type { MediaLayout } from '@/components/ui/media'
import type { ImageMosaicBlock as ImageMosaicBlockType, ImageMosaicImage } from '@/lib/sanity/types'

interface Props {
  block: ImageMosaicBlockType
}

function MosaicImage({ item, width }: { item: ImageMosaicImage; width: number }) {
  return (
    <Media
      type="image"
      src={urlFor(item.image).width(width).auto('format').url()}
      alt={item.altText || ''}
      layout="thumbnail"
      aspectRatio={item.size === 'large' ? '3/2' : '4/3'}
      caption={item.caption}
      animate={false}
    />
  )
}

export function ImageMosaicBlock({ block }: Props) {
  const layout = (block.layout as MediaLayout) ?? 'full-width'
  const images = block.images ?? []

  if (images.length < 2) return null

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

  // Assign grid column spans: large groups get col-span-7, small stacks get col-span-5
  // If all groups are the same size, split evenly (col-span-6 each)
  const allLarge = groups.every((g) => g[0].size === 'large')
  const allSmall = groups.every((g) => g[0].size === 'small')
  const even = allLarge || allSmall

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className={`${MEDIA_OUTER[layout]} ${MEDIA_SPACING[layout]}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {groups.map((group, i) => {
          const isLarge = group[0].size === 'large'
          const span = even ? 'md:col-span-6' : isLarge ? 'md:col-span-7' : 'md:col-span-5'

          if (group.length === 1) {
            return (
              <div key={group[0]._key || i} className={span}>
                <MosaicImage item={group[0]} width={isLarge ? 1200 : 800} />
              </div>
            )
          }

          // Stacked small images
          return (
            <div key={group[0]._key || i} className={`${span} flex flex-col gap-4`}>
              {group.map((item, j) => (
                <MosaicImage key={item._key || j} item={item} width={800} />
              ))}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
