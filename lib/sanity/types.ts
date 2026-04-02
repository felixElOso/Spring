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

export type BlockLayout = 'full-bleed' | 'full-width' | 'contained'

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
}

export interface StatsBlock {
  _type: 'statsBlock'
  _key: string
  items: StatsBlockItem[]
  layout: 'contained' | 'full-width'
}

export interface HeadingBlock {
  _type: 'headingBlock'
  _key: string
  text: string
  layout: 'contained' | 'full-width' | 'half'
}

export interface ImageMosaicImage {
  _key: string
  image: SanityImage
  caption?: string
  altText?: string
  size: 'large' | 'small'
}

export interface ImageMosaicBlock {
  _type: 'imageMosaicBlock'
  _key: string
  images: ImageMosaicImage[]
  layout: BlockLayout
}

export type ContentBlock = RichTextBlock | ImageBlock | GalleryBlock | VideoBlock | AnimationBlock | TextBlock | StatsBlock | HeadingBlock | ImageMosaicBlock

export interface Project {
  _id: string
  title: string
  slug: SanitySlug
  client?: string
  year?: number
  description?: string
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
  thumbnailSize?: 'regular' | 'large'
  contentBlocks?: ContentBlock[]
  seo?: {
    title?: string
    description?: string
    ogImage?: SanityImage
  }
  nextProject?: {
    title: string
    slug: SanitySlug
    coverImage?: SanityImage
  }
}

export interface TeamMember {
  _id: string
  name: string
  role?: string
  bio?: string
  photo?: SanityImage
}
