'use client'

import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { Media, MEDIA_OUTER, MEDIA_SPACING } from '@/components/ui/media'
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider'
import type { MediaLayout } from '@/components/ui/media'
import type { ImageMosaicBlock as ImageMosaicBlockType, ImageMosaicImage, ImageMosaicRow } from '@/lib/sanity/types'

interface Props {
  block: ImageMosaicBlockType
}

// Converts a public Vimeo / YouTube URL into an embed URL. Mirrors VideoBlock.
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

function MosaicItem({ item, width, rounded, sizes, fillHeight }: { item: ImageMosaicImage; width: number; rounded?: boolean; sizes?: string; fillHeight?: boolean }) {
  const isBeforeAfter = item.mediaType === 'beforeAfter' && item.beforeImage && item.afterImage
  const isVideo = item.mediaType === 'video'
  // Stroke is controlled per-image, so each mosaic item can opt in independently.
  const stroke = item.stroke ?? false
  const aspectRatio = item.size === 'large' ? '3/2' : '4/3'
  // 'contain' shows the whole image at its own ratio (never masked). It also
  // wins over fillHeight for images: stretching to fill a row would re-introduce
  // cropping, which defeats the point of asking for the full image.
  const fitContain = item.fit === 'contain'
  const fillHeightImage = fillHeight && !fitContain

  if (isBeforeAfter) {
    const beforeUrl = urlFor(item.beforeImage!).width(width).quality(90).auto('format').fit('max').url()
    const afterUrl = urlFor(item.afterImage!).width(width).quality(90).auto('format').fit('max').url()

    return (
      <div className={`${rounded ? 'overflow-hidden rounded-3xl' : ''} ${stroke ? 'border border-foreground/30' : ''} ${fillHeight ? 'h-full' : ''}`}>
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

  if (isVideo) {
    const autoplay = item.videoAutoplay ?? false
    const isFile = item.videoType === 'file'
    const fileSrc = item.videoFile?.asset?.url
    const embedSrc = item.videoUrl ? toEmbedUrl(item.videoUrl, autoplay) : undefined
    const src = isFile ? fileSrc : embedSrc
    if (!src) return null

    // 'Full' fit shows a file video at its native proportions — no box, no
    // cropping. Like images, it wins over fillHeight: stretching to fill a row
    // would re-introduce the distortion the editor opted out of.
    if (fitContain && isFile) {
      return (
        <div className="flex flex-col">
          <div className={`overflow-hidden ${rounded ? 'rounded-3xl' : ''} ${stroke ? 'border border-foreground/30' : ''}`}>
            <video
              src={src}
              autoPlay={autoplay}
              loop
              muted
              playsInline
              controls={!autoplay}
              className="w-full h-auto"
            />
          </div>
          {item.caption && (
            <p className="mt-3 text-sm text-foreground/50">{item.caption}</p>
          )}
        </div>
      )
    }

    // Surface fills its container; mobile keeps an aspect ratio (cells stack),
    // and fillHeight stretches the surface to match a taller stacked cell at md+.
    // Embeds with 'Full' fit keep a 16:9 surface (an iframe's native ratio is
    // unknowable) — the player letterboxes inside it, so nothing is cut off.
    const boxAspect = fitContain ? 'aspect-video' : aspectRatio === '3/2' ? 'aspect-[3/2]' : 'aspect-[4/3]'
    const surfaceClass = fillHeight && !fitContain
      ? `relative w-full overflow-hidden aspect-[3/2] md:aspect-auto md:flex-1 ${rounded ? 'rounded-3xl' : ''} ${stroke ? 'border border-foreground/30' : ''}`
      : `relative w-full overflow-hidden ${boxAspect} ${rounded ? 'rounded-3xl' : ''} ${stroke ? 'border border-foreground/30' : ''}`

    return (
      <div className={`flex flex-col ${fillHeight ? 'md:h-full' : ''}`}>
        <div className={surfaceClass}>
          {isFile ? (
            <video
              src={src}
              autoPlay={autoplay}
              loop
              muted
              playsInline
              controls={!autoplay}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <iframe
              src={src}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={item.altText || item.caption || 'Video'}
            />
          )}
        </div>
        {item.caption && (
          <p className="mt-3 text-sm text-foreground/50">{item.caption}</p>
        )}
      </div>
    )
  }

  const imgSrc = urlFor(item.image).width(width).quality(90).auto('format').fit('max').url()

  // When asked to fill height (a single-image cell sitting beside a taller
  // stacked cell), keep a normal aspect ratio on mobile — where cells stack
  // vertically — and only stretch to fill the row height from md up.
  // Skipped when the editor chose Full ('contain'), which must never crop.
  if (fillHeightImage) {
    return (
      <div className="flex flex-col md:h-full">
        <div className={`relative w-full overflow-hidden aspect-[3/2] md:aspect-auto md:flex-1 ${rounded ? 'rounded-3xl' : ''} ${stroke ? 'border border-foreground/30' : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={item.altText || ''}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        {item.caption && (
          <p className="mt-3 text-sm text-foreground/50">{item.caption}</p>
        )}
      </div>
    )
  }

  return (
    <div className={`${rounded ? 'overflow-hidden rounded-3xl' : ''} ${stroke ? 'border border-foreground/30' : ''}`}>
      <Media
        type="image"
        src={imgSrc}
        alt={item.altText || ''}
        layout="thumbnail"
        aspectRatio={fitContain ? 'auto' : item.size === 'large' ? '3/2' : '4/3'}
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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
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
          <div key={group[0]._key || i} className={`${span} flex flex-col gap-10`}>
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
    <div className="flex flex-col gap-10">
      {/* Large feature image on top */}
      <div>
        <MosaicItem item={feature} width={2400} rounded={rounded} sizes="100vw" />
      </div>

      {/* Smaller images below in a row */}
      {rest.length > 0 && (
        <div className={`grid grid-cols-1 gap-10 ${
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

function RowsLayout({ rows, rounded }: { rows: ImageMosaicRow[]; rounded: boolean }) {
  return (
    <div className="flex flex-col gap-10">
      {rows.map((row, i) => {
        // A cell holds one image or a vertical stack. Fall back to the legacy
        // flat `images` list (each image = its own single-image cell).
        const cells: ImageMosaicImage[][] =
          row.cells && row.cells.length > 0
            ? row.cells.map((c) => c.images ?? [])
            : (row.images ?? []).map((img) => [img])

        const validCells = cells.filter((c) => c.length > 0)
        if (validCells.length === 0) return null

        // Each cell shares the row width evenly. Stacks on mobile, side-by-side
        // from md up. Width hint scales with cells-per-row.
        const perCellWidth = validCells.length === 1 ? 2400 : validCells.length === 2 ? 1600 : 1200
        const sizes =
          validCells.length === 1
            ? '100vw'
            : `(max-width: 768px) 100vw, ${Math.round(100 / validCells.length)}vw`

        // If any cell stacks multiple images, single-image cells stretch to
        // match the taller stacked cell's height when side-by-side.
        const hasStackedCell = validCells.some((c) => c.length > 1)

        // A Full-fit item renders at its natural height and anchors the row —
        // Crop siblings stretch to match it so side-by-side items stay equal
        // height. (Only when one exists: if every cell were stretch-to-fill,
        // nothing would define the row height and it would collapse.)
        const hasContainCell = validCells.some((c) =>
          c.some((it) => it.fit === 'contain')
        )

        // A fixed row height keeps every item tall (filling the row) instead of
        // collapsing to its natural aspect ratio when placed side-by-side.
        // Applied from md up; on mobile cells still stack at their own ratios.
        const fixedHeight = row.rowHeight === 'tall' || row.rowHeight === 'xtall'
        const rowHeightClass =
          row.rowHeight === 'tall' ? 'md:h-[70vh]' : row.rowHeight === 'xtall' ? 'md:h-[90vh]' : ''

        // Single-image cells fill the row height when it's fixed, when a
        // sibling cell stacks images and is therefore taller, or when a
        // Full-fit sibling sets the row height in a multi-cell row.
        const fillSingleCells =
          fixedHeight || hasStackedCell || (validCells.length > 1 && hasContainCell)

        return (
          <div key={row._key || i} className={`flex flex-col gap-10 md:flex-row md:items-stretch ${rowHeightClass}`}>
            {validCells.map((cellImages, j) => (
              <div key={j} className="min-w-0 flex-1 md:basis-0 flex flex-col gap-10">
                {cellImages.map((item, k) => (
                  <MosaicItem
                    key={item._key || k}
                    item={item}
                    width={perCellWidth}
                    rounded={rounded}
                    sizes={sizes}
                    fillHeight={fillSingleCells && cellImages.length === 1}
                  />
                ))}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export function ImageMosaicBlock({ block }: Props) {
  const layout = (block.layout as MediaLayout) ?? 'full-width'
  const images = block.images ?? []
  const rows = block.rows ?? []
  const mosaicStyle = block.mosaicStyle ?? 'side-by-side'
  const rounded = layout !== 'full-bleed'

  // Guard: each style needs its own content present. A row counts as populated
  // if it has cells with images, or legacy flat images.
  const rowHasImages = (r: ImageMosaicRow) =>
    (r.cells ?? []).some((c) => (c.images ?? []).length > 0) || (r.images ?? []).length > 0
  if (mosaicStyle === 'rows') {
    if (rows.length === 0 || rows.every((r) => !rowHasImages(r))) return null
  } else if (images.length < 2) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className={`${MEDIA_OUTER[layout]} ${MEDIA_SPACING[layout]}`}
    >
      {mosaicStyle === 'rows' ? (
        <RowsLayout rows={rows} rounded={rounded} />
      ) : mosaicStyle === 'feature' ? (
        <FeatureLayout images={images} rounded={rounded} />
      ) : (
        <SideBySideLayout images={images} rounded={rounded} />
      )}
    </motion.div>
  )
}
