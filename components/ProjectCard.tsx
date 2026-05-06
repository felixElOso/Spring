'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { Media } from '@/components/ui/media'
import type { Project } from '@/lib/sanity/types'

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export function ProjectCard({ project, featured }: ProjectCardProps) {
  // Resolve the video source: uploaded file takes priority over URL
  const videoSrc = project.coverVideoFile?.asset?.url ?? project.coverVideo

  // Use video thumbnail only when explicitly chosen in Sanity
  const useVideo = project.thumbnailMedia === 'video' && !!videoSrc

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

  const mediaSizes = isLarge ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={isLarge ? 'md:col-span-2' : ''}
    >
      <Link href={`/projects/${project.slug.current}`} className="group block">
        {/* Cover media — either a video or an image, controlled by thumbnailMedia field */}
        {useVideo ? (
          <Media
            type="video"
            src={videoSrc}
            alt={project.title}
            layout="thumbnail"
            aspectRatio="4/3"
            autoplay
            muted
            loop
            controls={false}
            priority={isLarge}
            sizes={mediaSizes}
            animate={false}
          />
        ) : (
          <Media
            type="image"
            src={coverImageUrl ?? undefined}
            alt={project.title}
            layout="thumbnail"
            aspectRatio="4/3"
            priority={isLarge}
            sizes={mediaSizes}
            animate={false}
          />
        )}

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
