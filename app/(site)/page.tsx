import { client } from '@/lib/sanity/client'
import { getAllProjectsQuery } from '@/lib/sanity/queries'
import { ProjectCard } from '@/components/ProjectCard'
import type { Project } from '@/lib/sanity/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work — Studio',
  description: 'Selected work from our design studio.',
}

export const revalidate = 60

export default async function HomePage() {
  let projects: Project[] = []
  try {
    projects = await client.fetch(getAllProjectsQuery)
  } catch {
    projects = []
  }

  return (
    <div className="pt-16">
      {/* Project grid */}
      <section className="max-w-content mx-auto section-pad pt-24 pb-32">
        {projects.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="bg-muted animate-pulse" style={{ aspectRatio: '4/3' }} />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-project">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
