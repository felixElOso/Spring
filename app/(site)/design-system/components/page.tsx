"use client"

import { HeroSection } from "@/components/ui/hero-section"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { SectionHeading } from "@/components/ui/section-heading"
import { TextBlock } from "@/components/ui/text-block"
import { Tag } from "@/components/ui/tag"
import { Card, CardImage, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Divider } from "@/components/ui/divider"
import { Stats } from "@/components/ui/stats"
import { StatTile } from "@/components/ui/stat-tile"
import { Button } from "@/components/ui/button"

export default function ComponentsPage() {
  return (
    <>
      {/* ── Hero Section ──────────────────────────────────────────── */}
      <HeroSection
        title="Components"
        subtitle="A set of reusable building blocks for assembling pages. Built on the design system tokens."
      />

      <Divider className="section-pad mx-auto max-w-[var(--max-w-content)]" />

      {/* ── Section Heading ───────────────────────────────────────── */}
      <SectionWrapper>
        <SectionHeading
          title="Section Heading"
          subtitle="Use for introducing major content areas. Left-aligned by default."
        />
        <div className="mt-12 rounded-lg border border-border p-8 bg-card">
          <SectionHeading title="Left Aligned" subtitle="Optional subtitle text goes here." />
          <Divider className="my-8" />
          <SectionHeading title="Center Aligned" subtitle="Pass align='center' for centered headings." align="center" />
        </div>
      </SectionWrapper>

      {/* ── Text Block ────────────────────────────────────────────── */}
      <SectionWrapper surface="muted">
        <SectionHeading title="Text Block" subtitle="For body copy and descriptive text outside of Sanity content." />
        <div className="space-y-8">
          <TextBlock>
            We believe design is a conversation between form and function. Every project starts with understanding the problem, then crafting a solution that feels inevitable. Good design disappears — great design makes you feel something.
          </TextBlock>
          <TextBlock size="lg">
            This is the large variant — ideal for lead paragraphs, pull quotes, or introductory copy that deserves more visual weight.
          </TextBlock>
        </div>
      </SectionWrapper>

      {/* ── Tags ──────────────────────────────────────────────────── */}
      <SectionWrapper>
        <SectionHeading title="Tags" subtitle="Pill-shaped labels for categorizing content." />
        <div className="flex flex-wrap gap-3">
          <Tag>Brand Design</Tag>
          <Tag>UI/UX</Tag>
          <Tag>Motion</Tag>
          <Tag variant="accent">Featured</Tag>
          <Tag variant="accent">New</Tag>
          <Tag variant="outline">2024</Tag>
          <Tag variant="outline">Case Study</Tag>
        </div>
      </SectionWrapper>

      <Divider className="section-pad mx-auto max-w-[var(--max-w-content)]" />

      {/* ── Cards ─────────────────────────────────────────────────── */}
      <SectionWrapper>
        <SectionHeading title="Cards" subtitle="Versatile containers for team members, features, or any grouped content." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover>
            <CardImage>
              <div className="aspect-[4/3] bg-secondary" />
            </CardImage>
            <CardContent>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>
                Complete visual identity systems including logos, typography, and color palettes.
              </CardDescription>
              <div className="mt-4 flex gap-2">
                <Tag>Branding</Tag>
                <Tag variant="accent">Featured</Tag>
              </div>
            </CardContent>
          </Card>
          <Card hover>
            <CardImage>
              <div className="aspect-[4/3] bg-accent/10" />
            </CardImage>
            <CardContent>
              <CardTitle>Product Design</CardTitle>
              <CardDescription>
                End-to-end product design from research and wireframes to polished interfaces.
              </CardDescription>
              <div className="mt-4 flex gap-2">
                <Tag>UI/UX</Tag>
                <Tag>Research</Tag>
              </div>
            </CardContent>
          </Card>
          <Card hover>
            <CardImage>
              <div className="aspect-[4/3] bg-foreground/5" />
            </CardImage>
            <CardContent>
              <CardTitle>Motion Design</CardTitle>
              <CardDescription>
                Purposeful animation that guides attention and elevates user experience.
              </CardDescription>
              <div className="mt-4 flex gap-2">
                <Tag>Motion</Tag>
                <Tag>Interaction</Tag>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <SectionWrapper>
        <SectionHeading title="Stats" subtitle="Number/label pairs for metrics, highlights, or key figures." />
        <Stats
          items={[
            { value: "50+", label: "Projects delivered" },
            { value: "12", label: "Team members" },
            { value: "8yr", label: "In business" },
          ]}
        />
        <div className="mt-16">
          <Stats
            columns={4}
            items={[
              { value: "98%", label: "Client satisfaction" },
              { value: "4.9", label: "Average rating" },
              { value: "15", label: "Awards won" },
              { value: "3", label: "Global offices" },
            ]}
          />
        </div>
      </SectionWrapper>

      {/* ── Stat Tile ──────────────────────────────────────────────── */}
      <SectionWrapper>
        <SectionHeading title="Stat Tile" subtitle="Card-based stat display for key metrics. Horizontally scrollable in context." />
        <div className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-visible scrollbar-hide">
          <div className="flex-shrink-0 w-[360px]">
            <StatTile value="50%" label="First Time Users as a % of Total Base" description="First-time investors grew to over 50% of the total user base within two years." />
          </div>
          <div className="flex-shrink-0 w-[360px]">
            <StatTile value="12M+" label="Active Users" description="Monthly active users across all platforms and regions." />
          </div>
          <div className="flex-shrink-0 w-[360px]">
            <StatTile value="4.9" label="App Store Rating" />
          </div>
        </div>
      </SectionWrapper>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <SectionWrapper>
        <SectionHeading title="Divider" subtitle="Subtle separators between content sections." />
        <div className="space-y-8">
          <div>
            <p className="text-sm text-muted-foreground mb-4">Default</p>
            <Divider />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">Accent</p>
            <Divider accent />
          </div>
        </div>
      </SectionWrapper>

      {/* ── Composed Example ──────────────────────────────────────── */}
      <SectionWrapper surface="muted">
        <SectionHeading
          title="Composed Example"
          subtitle="Components work together to build complete page sections."
        />
        <div className="grid-content-split items-start">
          <div>
            <TextBlock size="lg">
              We partner with ambitious brands to create design systems, digital products, and visual identities that scale.
            </TextBlock>
            <div className="mt-8 flex flex-wrap gap-3">
              <Tag variant="accent">Strategy</Tag>
              <Tag variant="accent">Design</Tag>
              <Tag variant="accent">Development</Tag>
            </div>
            <div className="mt-8">
              <Button>View our work</Button>
            </div>
          </div>
          <Stats
            columns={2}
            items={[
              { value: "150+", label: "Brands served" },
              { value: "24/7", label: "Support" },
              { value: "6", label: "Disciplines" },
              { value: "100%", label: "In-house" },
            ]}
          />
        </div>
      </SectionWrapper>
    </>
  )
}
