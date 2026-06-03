import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client, urlFor } from '@/lib/sanity/client'
import { getProjectBySlugQuery, getAllProjectsQuery } from '@/lib/sanity/queries'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { ProjectHero } from '@/components/blocks/ProjectHero'
import { NextProjectTeaser } from '@/components/blocks/NextProjectTeaser'
import { flattenTitle } from '@/lib/utils'
import type { Project } from '@/lib/sanity/types'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects: Project[] = await client.fetch(getAllProjectsQuery).catch(() => [])
  return projects.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project: Project | null = await client
    .fetch(getProjectBySlugQuery, { slug })
    .catch(() => null)

  if (!project) return {}

  const ogImageUrl = project.seo?.ogImage
    ? urlFor(project.seo.ogImage).width(1200).height(630).url()
    : project.coverImage
    ? urlFor(project.coverImage).width(1200).height(630).url()
    : undefined

  return {
    title: project.seo?.title || flattenTitle(project.title),
    description: project.seo?.description || project.description,
    openGraph: ogImageUrl ? { images: [{ url: ogImageUrl }] } : undefined,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project: Project | null = await client
    .fetch(getProjectBySlugQuery, { slug })
    .catch(() => null)

  if (!project) notFound()

  const coverUrl = project.coverImage
    ? urlFor(project.coverImage).width(2400).quality(90).auto('format').fit('max').url()
    : null

  return (
    <article>
      {/* 1. Hero — cover media, oversized title, Challenge / Solution */}
      <ProjectHero
        title={project.title}
        coverUrl={coverUrl}
        coverVideoUrl={project.coverVideoFile?.asset?.url || project.coverVideo}
        challenge={project.challenge}
        solution={project.solution}
      />

      {/* 2. Content blocks */}
      {project.contentBlocks && project.contentBlocks.length > 0 && (
        <div className="pb-8">
          <BlockRenderer blocks={project.contentBlocks} />
        </div>
      )}

      {/* 3. Next project teaser */}
      {project.nextProject && (
        <NextProjectTeaser project={project.nextProject} />
      )}
    </article>
  )
}
