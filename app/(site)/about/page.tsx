import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { getAllTeamMembersQuery, getAboutPageQuery } from '@/lib/sanity/queries'
import type { TeamMember, AboutPage as AboutPageData } from '@/lib/sanity/types'
import { Media } from '@/components/ui/media'

export const metadata: Metadata = {
  title: 'About — Studio',
  description: 'Meet the team behind the studio.',
}

export const revalidate = 10

function StatementText({ statement, highlight }: { statement: string; highlight?: string }) {
  if (!highlight) return <>{statement}</>
  const index = statement.indexOf(highlight)
  if (index === -1) return <>{statement}</>

  return (
    <>
      {statement.slice(0, index)}
      <span className="text-coral">{highlight}</span>
      {statement.slice(index + highlight.length)}
    </>
  )
}

export default async function AboutPage() {
  let team: TeamMember[] = []
  let about: AboutPageData | null = null
  try {
    ;[team, about] = await Promise.all([
      client.fetch(getAllTeamMembersQuery),
      client.fetch(getAboutPageQuery),
    ])
  } catch {
    team = []
    about = null
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

      {/* Statement — `whitespace-pre-line` renders the editor's Enter key
          presses as fixed line breaks, so the wrap stays put at every size
          instead of reflowing. */}
      {about?.statement && (
        <section className="section-pad pt-24 pb-24">
          <h1 className="whitespace-pre-line text-[clamp(2.25rem,6.4vw,5.25rem)] font-medium leading-[0.95] tracking-[-0.03em] text-foreground">
            <StatementText statement={about.statement} highlight={about.statementHighlight} />
          </h1>
        </section>
      )}

      {/* Who we are */}
      {team.length > 0 && (
        <section className="section-pad pb-24">
          <div className="border-t border-border pt-24">
            <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-medium tracking-[-0.03em] text-foreground mb-12">
              Who we are
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {team.map((member) => (
                <div key={member._id} className="flex flex-col gap-2">
                  <p className="text-2xl md:text-3xl font-normal leading-none tracking-[-0.03em] text-foreground">
                    {member.name}
                  </p>
                  {member.role && (
                    <p className="text-lg md:text-xl leading-none tracking-[-0.03em] text-foreground/50">
                      {member.role}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What we do */}
      {about?.services && about.services.length > 0 && (
        <section className="section-pad pb-24">
          <div className="border-t border-border pt-24">
            <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-medium tracking-[-0.03em] text-foreground mb-12">
              What we do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
              {about.services.map((service) => (
                <p key={service} className="text-2xl md:text-3xl tracking-[-0.02em] text-foreground">
                  {service}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact us */}
      {about?.contactLinks && about.contactLinks.length > 0 && (
        <section className="section-pad pb-32">
          <div className="border-t border-border pt-24">
            <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-medium tracking-[-0.03em] text-foreground mb-12">
              Contact us
            </h2>
            <div className="flex flex-col gap-5">
              {about.contactLinks.map((link) => (
                <a
                  key={link._key}
                  href={link.href}
                  className="text-2xl md:text-3xl tracking-[-0.02em] text-foreground hover:text-coral transition-colors duration-200 w-fit"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
