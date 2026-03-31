import Image from 'next/image'
import type { Metadata } from 'next'
import { client, urlFor } from '@/lib/sanity/client'
import { getAllTeamMembersQuery } from '@/lib/sanity/queries'
import type { TeamMember } from '@/lib/sanity/types'

export const metadata: Metadata = {
  title: 'About — Studio',
  description: 'Meet the team behind the studio.',
}

export const revalidate = 60

export default async function AboutPage() {
  let team: TeamMember[] = []
  try {
    team = await client.fetch(getAllTeamMembersQuery)
  } catch {
    team = []
  }

  return (
    <div className="pt-16">
      {/* Studio intro */}
      <section className="max-w-content mx-auto section-pad pt-24 pb-24">
        <h1 className="text-[clamp(3rem,8vw,7rem)] font-medium leading-none tracking-tight text-foreground mb-12">
          About
        </h1>
        <div className="max-w-2xl">
          <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
            We are a design studio focused on brand identity, digital products, and motion.
            We work with companies that want to make their mark.
          </p>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="max-w-content mx-auto section-pad pb-32">
          <p className="text-xs uppercase tracking-widest text-foreground/40 mb-16">Team</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {team.map((member) => {
              const photoUrl = member.photo
                ? urlFor(member.photo).width(600).height(600).auto('format').fit('crop').url()
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
