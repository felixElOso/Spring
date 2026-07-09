export interface SanitySlug {
  current: string
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
    url?: string
  }
  hotspot?: { x: number; y: number; width: number; height: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

export type BlockLayout = 'full-bleed' | 'full-width' | 'wide' | 'medium' | 'contained' | 'narrow'

export interface RichTextBlock {
  _type: 'richTextBlock'
  _key: string
  content: any[]
  layout: 'contained' | 'full-width'
}

export interface ImageBlock {
  _type: 'imageBlock'
  _key: string
  image: SanityImage
  caption?: string
  altText?: string
  aspectRatio?: string
  layout: BlockLayout
  stroke?: boolean
}

export interface GalleryImage {
  _key: string
  image: SanityImage
  caption?: string
  altText?: string
}

export interface GalleryBlock {
  _type: 'galleryBlock'
  _key: string
  images: GalleryImage[]
  columns: number
  enableLightbox: boolean
  aspectRatio?: string
  layout: BlockLayout
}

export interface VideoBlock {
  _type: 'videoBlock'
  _key: string
  videoType: 'vimeo' | 'youtube' | 'file'
  url?: string
  file?: { asset: { url: string } }
  autoplay: boolean
  caption?: string
  aspectRatio?: string
  layout: BlockLayout
}

export interface AnimationBlock {
  _type: 'animationBlock'
  _key: string
  animationType: 'lottie' | 'gif'
  lottieFile?: { asset: { url: string } }
  gifImage?: SanityImage
  backgroundColor?: string
  caption?: string
  aspectRatio?: string
  layout: BlockLayout
}

export interface TextBlock {
  _type: 'textBlock'
  _key: string
  title?: string
  body?: string
  layout: 'contained' | 'full-width' | 'half'
}

export interface StatsBlockItem {
  _key: string
  value: string
  label: string
  description?: string
}

export interface StatsCreditsColumn {
  _key: string
  label: string
  items: string[]
}

export interface StatsBlock {
  _type: 'statsBlock'
  _key: string
  title?: string
  items: StatsBlockItem[]
  credits?: StatsCreditsColumn[]
  layout: BlockLayout
}

export interface OverviewCreditsColumn {
  _key: string
  label: string
  items: string[]
}

export interface OverviewBlock {
  _type: 'overviewBlock'
  _key: string
  title?: string
  body: string
  credits?: OverviewCreditsColumn[]
  layout: BlockLayout
}

export interface HeadingBlock {
  _type: 'headingBlock'
  _key: string
  text: string
  layout: 'contained' | 'full-width' | 'half'
}

export interface ImageMosaicImage {
  _key: string
  mediaType?: 'image' | 'video' | 'beforeAfter'
  image: SanityImage
  // Video (file or Vimeo/YouTube embed)
  videoType?: 'vimeo' | 'youtube' | 'file'
  videoUrl?: string
  videoFile?: { asset: { url: string } }
  videoAutoplay?: boolean
  // Before / After
  beforeImage?: SanityImage
  afterImage?: SanityImage
  beforeLabel?: string
  afterLabel?: string
  caption?: string
  altText?: string
  size: 'large' | 'small'
  /** 'crop' (default) fills a uniform box with object-cover; 'contain' shows the whole image at its natural ratio so it's never masked. */
  fit?: 'crop' | 'contain'
  stroke?: boolean
}

export interface ImageMosaicCell {
  _key: string
  images: ImageMosaicImage[]
}

export interface ImageMosaicRow {
  _key: string
  /** Fixed row height so side-by-side items stay tall instead of shrinking to their natural aspect ratio. */
  rowHeight?: 'auto' | 'tall' | 'xtall'
  cells?: ImageMosaicCell[]
  /** Legacy flat image list — superseded by `cells`. Each image renders as its own cell. */
  images?: ImageMosaicImage[]
}

export interface ImageMosaicBlock {
  _type: 'imageMosaicBlock'
  _key: string
  images: ImageMosaicImage[]
  rows?: ImageMosaicRow[]
  mosaicStyle?: 'side-by-side' | 'feature' | 'rows'
  layout: BlockLayout
}

export interface MarqueeGalleryImage {
  _key: string
  image: SanityImage
  companionImage?: SanityImage
  altText?: string
}

export interface MarqueeGalleryRow {
  _key: string
  images: MarqueeGalleryImage[]
}

export interface MarqueeGalleryBlock {
  _type: 'marqueeGalleryBlock'
  _key: string
  rows: MarqueeGalleryRow[]
  speed: 'slow' | 'medium' | 'fast'
  pauseOnHover: boolean
  layout: BlockLayout
}

export interface MediaStripItem {
  _key: string
  mediaType?: 'image' | 'video'
  image: SanityImage
  // Video (file or Vimeo/YouTube embed)
  videoType?: 'vimeo' | 'youtube' | 'file'
  videoUrl?: string
  videoFile?: { asset: { url: string } }
  videoAspect?: '16/9' | '4/3' | '3/2' | '1/1' | '9/16'
  altText?: string
}

export interface MediaStripBlock {
  _type: 'mediaStripBlock'
  _key: string
  items: MediaStripItem[]
  height: 'small' | 'medium' | 'large'
  layout: BlockLayout
}

export interface QuoteBlock {
  _type: 'quoteBlock'
  _key: string
  quote: string
  attribution?: string
  layout: 'contained' | 'full-width'
}

export interface BeforeAfterBlock {
  _type: 'beforeAfterBlock'
  _key: string
  beforeImage: SanityImage
  afterImage: SanityImage
  beforeLabel?: string
  afterLabel?: string
  initialPosition?: number
  aspectRatio?: string
  layout: BlockLayout
}

export type ContentBlock = RichTextBlock | ImageBlock | GalleryBlock | VideoBlock | AnimationBlock | TextBlock | StatsBlock | OverviewBlock | HeadingBlock | ImageMosaicBlock | MarqueeGalleryBlock | MediaStripBlock | QuoteBlock | BeforeAfterBlock

export interface Project {
  _id: string
  title: string
  slug: SanitySlug
  client?: string
  year?: number
  description?: string
  challenge?: string
  solution?: string
  tags?: string[]
  featured: boolean
  coverImage?: SanityImage
  coverVideo?: string
  coverVideoFile?: { asset: { url: string } }
  coverAnimation?: {
    animationType?: 'lottie' | 'gif'
    lottieFile?: { asset: { url: string } }
    gifImage?: SanityImage
  }
  thumbnailMedia?: 'image' | 'video'
  thumbnailSize?: 'regular' | 'large'
  contentBlocks?: ContentBlock[]
  seo?: {
    title?: string
    description?: string
    ogImage?: SanityImage
  }
}

export interface TeamMember {
  _id: string
  name: string
  role?: string
  bio?: string
  photo?: SanityImage
}
