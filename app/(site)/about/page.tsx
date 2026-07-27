import Image from 'next/image'
import type { Metadata } from 'next'
import { client, urlFor } from '@/lib/sanity/client'
import { getAllTeamMembersQuery } from '@/lib/sanity/queries'
import type { TeamMember } from '@/lib/sanity/types'
import { Media } from '@/components/ui/media'

export const metadata: Metadata = {
  title: 'About — Studio',
  description: 'Meet the team behind the studio.',
}

export const revalidate = 10

export default async function AboutPage() {
  let team: TeamMember[] = []
  try {
    team = await client.fetch(getAllTeamMembersQuery)
  } catch {
    team = []
  }

  return (
    <div>
      {/* Hero image — flush to the top, sits under the transparent nav */}
      <Media
        type="image"
        src="/about-hero.jpg"
        alt="Spring studio"
        layout="full-bleed"
        aspectRatio="21/9"
        priority
        animate={false}
      />

      {/* Studio intro */}
      <section className="max-w-content mx-auto section-pad pt-24 pb-24">
        <h1 className="text-balance text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.95] tracking-[-0.03em] text-foreground">
          We are the in-house creative agency for TurboTax, shaping the brand
          experience across marketing, retail, and product.
        </h1>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="max-w-content mx-auto section-pad pb-32">
          <p className="text-xs uppercase tracking-widest text-foreground/40 mb-16">Team</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {team.map((member) => {
              const photoUrl = member.photo
                ? urlFor(member.photo).width(1200).height(1200).quality(90).auto('format').fit('crop').url()
                : null

              return (
                <div key={member._id}>
                  {photoUrl ? (
                    <div className="relative overflow-hidden bg-muted mb-5" style={{ aspectRatio: '1/1' }}>
                      <Image
                        src={photoUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        quality={90}
                      />
                    </div>
                  ) : (
                    <div className="bg-muted mb-5" style={{ aspectRatio: '1/1' }} />
                  )}
                  <p className="font-medium text-foreground">{member.name}</p>
                  {member.role && (
                    <p className="text-sm text-foreground/50 mt-1">{member.role}</p>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
