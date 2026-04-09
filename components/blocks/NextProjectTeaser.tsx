import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/lib/sanity/client"
import type { SanityImage, SanitySlug } from "@/lib/sanity/types"

interface NextProjectTeaserProps {
  project: {
    title: string
    slug: SanitySlug
    coverImage?: SanityImage
  }
}

export function NextProjectTeaser({ project }: NextProjectTeaserProps) {
  const coverUrl = project.coverImage
    ? urlFor(project.coverImage).width(2400).quality(90).auto("format").fit("max").url()
    : null

  return (
    <Link
      href={`/projects/${project.slug.current}`}
      className="group block relative w-full overflow-hidden bg-secondary"
      style={{ minHeight: "40vh" }}
    >
      {coverUrl && (
        <Image
          src={coverUrl}
          alt={project.title}
          fill
          className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
          sizes="100vw"
          quality={90}
        />
      )}
      <div className="relative z-10 mx-auto max-w-[var(--max-w-content)] section-pad py-20 md:py-28 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Next Project
          </p>
          <p className="text-[clamp(2rem,5vw,5rem)] font-medium leading-none text-foreground">
            {project.title}
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="block text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-5xl leading-none">
            →
          </span>
        </div>
      </div>
    </Link>
  )
}
