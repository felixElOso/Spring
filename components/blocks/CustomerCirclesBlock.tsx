'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { MEDIA_OUTER } from '@/components/ui/media'
import type { MediaLayout } from '@/components/ui/media'
import type { CustomerCirclesBlock as CustomerCirclesBlockType, CustomerCircle } from '@/lib/sanity/types'

interface Props {
  block: CustomerCirclesBlockType
  /**
   * Resolves a customer's image to a URL. Defaults to the Sanity image
   * pipeline; the `size` arg is the requested square edge in px. Overridable
   * so the layout can be previewed with non-Sanity images.
   */
  srcFor?: (customer: CustomerCircle, size: number) => string
}

function defaultSrcFor(customer: CustomerCircle, size: number): string {
  return urlFor(customer.image).width(size).height(size).quality(90).auto('format').fit('crop').url()
}

// ─── Scatter layout ─────────────────────────────────────────────────────────
//
// Positions are expressed as percentages of a fixed-ratio canvas (matching the
// Figma frame's ~2.29:1 dark panel). Seeded from the Figma cluster, then run
// through a relaxation pass that adjusts both position and size so every circle
// ends up roughly the same distance from its neighbors (even gaps, no overlaps)
// while keeping the organic, mixed-size character. `s` is the diameter as % of
// canvas width. We cycle through this list, so the block stays balanced whether
// the CMS has 6 customers or 26.

interface Slot {
  x: number // center X, % of canvas width
  y: number // center Y, % of canvas height
  s: number // diameter, % of canvas width
}

const SLOTS: Slot[] = [
  { x: 11.4, y: 23.1, s: 10.61 },
  { x: 22.4, y: 12.8, s: 9.98 },
  { x: 33.0, y: 28.4, s: 12.0 },
  { x: 42.6, y: 43.4, s: 7.53 },
  { x: 46.2, y: 15.5, s: 13.53 },
  { x: 53.5, y: 42.1, s: 10.79 },
  { x: 68.2, y: 22.7, s: 19.85 },
  { x: 86.1, y: 15.3, s: 13.35 },
  { x: 94.5, y: 34.9, s: 7.55 },
  { x: 83.4, y: 53.7, s: 17.03 },
  { x: 67.3, y: 64.1, s: 13.16 },
  { x: 56.5, y: 63.0, s: 8.0 },
  { x: 46.0, y: 64.4, s: 8.06 },
  { x: 33.4, y: 61.5, s: 13.47 },
  { x: 20.9, y: 43.6, s: 12.34 },
  { x: 7.2, y: 54.0, s: 13.29 },
  { x: 19.1, y: 77.9, s: 14.63 },
  { x: 30.5, y: 88.0, s: 6.72 },
  { x: 40.5, y: 87.5, s: 10.19 },
  { x: 53.4, y: 85.8, s: 12.44 },
  { x: 65.0, y: 91.1, s: 7.74 },
  { x: 76.2, y: 86.2, s: 9.89 },
]

// The slot diameters above are tuned so the gaps come out even. The optional
// per-customer size field still lets an editor lean a circle a little bigger or
// smaller, but the effect is intentionally gentle (±6%).
const SIZE_NUDGE: Record<NonNullable<CustomerCircle['size']>, number> = {
  lg: 1.06,
  md: 1,
  sm: 0.94,
}

// Deterministic pseudo-random in [0, 1) from an integer seed — keeps drift
// stable across renders (no hydration mismatch) while varying per circle.
function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function Circle({
  customer,
  slot,
  index,
  reduceMotion,
  src,
}: {
  customer: CustomerCircle
  slot: Slot
  index: number
  reduceMotion: boolean
  src: string
}) {
  const diameter = slot.s * (SIZE_NUDGE[customer.size ?? 'md'] ?? 1)

  // Per-circle drift: a slow, looping offset with randomized amplitude, phase,
  // and duration so the cluster gently breathes without ever syncing up.
  // Amplitudes are kept small so circles stay near their evenly-spaced resting
  // positions and the gaps don't visibly fluctuate.
  const driftX = 0.84 + rand(index) * 0.98
  const driftY = 1.12 + rand(index + 31) * 1.26
  const duration = 6 + rand(index + 7) * 5
  const delay = rand(index + 13) * -duration // negative → start mid-cycle

  const alt = customer.role ? `${customer.name} — ${customer.role}` : customer.name

  return (
    <div
      className="absolute"
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        width: `${diameter}%`,
      }}
    >
      {/* Centering offset, kept off the animated element so it doesn't fight
          the drift transform. */}
      <div className="w-full" style={{ transform: 'translate(-50%, -50%)' }}>
        <motion.div
          className="w-full"
          animate={
            reduceMotion
              ? { x: 0, y: 0 }
              : {
                  x: [`-${driftX}%`, `${driftX}%`, `-${driftX}%`],
                  y: [`${driftY}%`, `-${driftY}%`, `${driftY}%`],
                }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration, delay, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <span className="relative block aspect-square w-full overflow-hidden rounded-full bg-pepper-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </span>
        </motion.div>
      </div>
    </div>
  )
}

export function CustomerCirclesBlock({ block, srcFor = defaultSrcFor }: Props) {
  const { customers = [], layout = 'full-bleed' } = block
  const reduceMotion = useReducedMotion() ?? false

  if (customers.length === 0) return null

  const outer = MEDIA_OUTER[(layout as MediaLayout) ?? 'full-bleed']

  return (
    <section className={outer}>
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className={`absolute inset-0 bg-pepper-130 ${
            layout === 'full-bleed' ? '' : 'rounded-media'
          }`}
        />

        {/* ── Desktop: floating scatter on a fixed-ratio canvas ──
            The outer wrapper's vertical padding keeps a margin of dark space
            above and below the cluster so circles never sit flush against the
            panel edges. The inner element holds the fixed aspect ratio that the
            absolute circles position against. */}
        <div className="relative hidden md:block py-12 lg:py-16">
          <div className="relative" style={{ aspectRatio: '2.29 / 1' }}>
            {customers.map((customer, i) => (
              <Circle
                key={customer._key}
                customer={customer}
                slot={SLOTS[i % SLOTS.length]}
                index={i}
                reduceMotion={reduceMotion}
                src={srcFor(customer, 560)}
              />
            ))}
          </div>
        </div>

        {/* ── Mobile: tidy centered cluster ── */}
        <div className="relative flex flex-wrap items-center justify-center gap-4 px-6 py-12 md:hidden">
          {customers.map((customer) => (
            <span
              key={customer._key}
              className="relative h-20 w-20 overflow-hidden rounded-full bg-pepper-80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={srcFor(customer, 320)}
                alt={customer.role ? `${customer.name} — ${customer.role}` : customer.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
