'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { Media } from '@/components/ui/media'
import type { Project } from '@/lib/sanity/types'

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export function ProjectCard({ project, featured }: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoVisible, setVideoVisible] = useState(false)

  // Resolve the hover video source: uploaded file takes priority over URL
  const hoverVideoSrc = project.coverVideoFile?.asset?.url ?? project.coverVideo

  const handleMouseEnter = () => {
    if (hoverVideoSrc || project.coverAnimation) {
      setVideoVisible(true)
      videoRef.current?.play()
    }
  }

  const handleMouseLeave = () => {
    if (hoverVideoSrc || project.coverAnimation) {
      setVideoVisible(false)
      videoRef.current?.pause()
      if (videoRef.current) videoRef.current.currentTime = 0
    }
  }

  // Determine if this card should span 2 columns
  const isLarge = project.thumbnailSize === 'large' || featured

  const coverImageUrl = project.coverImage
    ? urlFor(project.coverImage)
        .width(isLarge ? 2400 : 1600)
        .height(isLarge ? 1800 : 1200)
        .quality(90)
        .auto('format')
        .fit('max')
        .url()
    : null

  // Resolve animation cover
  const gifUrl = project.coverAnimation?.animationType === 'gif' && project.coverAnimation.gifImage
    ? urlFor(project.coverAnimation.gifImage).quality(90).auto('format').fit('max').url()
    : null
  const lottieUrl = project.coverAnimation?.animationType === 'lottie'
    ? project.coverAnimation.lottieFile?.asset?.url
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={isLarge ? 'md:col-span-2' : ''}
    >
      <Link href={`/projects/${project.slug.current}`} className="group block">
        {/* Cover media */}
        <Media
          type="image"
          src={coverImageUrl ?? undefined}
          alt={project.title}
          layout="thumbnail"
          aspectRatio="4/3"
          priority={isLarge}
          sizes={isLarge ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
          animate={false}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Hover video (URL or uploaded file) */}
          {hoverVideoSrc && (
            <video
              ref={videoRef}
              src={hoverVideoSrc}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                videoVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Hover GIF animation */}
          {!hoverVideoSrc && gifUrl && (
            <Image
              src={gifUrl}
              alt={project.title}
              fill
              unoptimized
              className={`absolute inset-0 object-cover transition-opacity duration-500 ${
                videoVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </Media>

        {/* Info */}
        <div className="mt-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base font-medium text-foreground group-hover:text-coral transition-colors duration-200">
              {project.title}
            </h3>
            {project.year && (
              <span className="text-sm text-foreground/40 shrink-0">{project.year}</span>
            )}
          </div>

          {project.client && (
            <p className="mt-1 text-sm text-foreground/60">{project.client}</p>
          )}

          {project.tags && project.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium uppercase tracking-wider text-coral"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
