import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'
import { getAllProjectsQuery } from '@/lib/sanity/queries'
import type { Project } from '@/lib/sanity/types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studio.example.com'

  let projects: Project[] = []
  try {
    projects = await client.fetch(getAllProjectsQuery)
  } catch {
    projects = []
  }

  const projectUrls = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug.current}`,
    lastModified: new Date(),
  }))

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    ...projectUrls,
  ]
}
