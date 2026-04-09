'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useTheme } from '@/lib/theme'
import { Media } from '@/components/ui/media'
import type { MediaType, MediaLayout, MediaRatio } from '@/components/ui/media'

// ─── Color Token Data ──────────────────────────────────────────────────────────

const primitives = [
  { name: 'cream',  value: '#F4F4EF', textColor: '#21262A' },
  { name: 'ink',   value: '#21262A', textColor: '#F4F4EF' },
  { name: 'coral', value: '#FF808C', textColor: '#FFFFFF' },
  { name: 'white', value: '#FFFFFF', textColor: '#21262A', bordered: true },
]

// ─── Watermelon Ramp Data ──────────────────────────────────────────────────────

const watermelonRamp = [
  { step: '0',   hex: '#FFF6F6' },
  { step: '10',  hex: '#FFE7E7' },
  { step: '20',  hex: '#FFD4D8' },
  { step: '30',  hex: '#FFB8BE' },
  { step: '40',  hex: '#FF9BA4' },
  { step: '50',  hex: '#FF808C', alias: 'coral' },
  { step: '60',  hex: '#F7576C' },
  { step: '70',  hex: '#DB334D' },
  { step: '80',  hex: '#B61A37' },
  { step: '90',  hex: '#8F1229' },
  { step: '100', hex: '#6E0B1E' },
  { step: '110', hex: '#4F0513' },
  { step: '120', hex: '#40030E' },
]

// ─── Tofu Ramp Data ────────────────────────────────────────────────────────────

const tofuRamp = [
  { step: '100', hex: '#F4F4EF', alias: 'cream' },
  { step: '110', hex: '#EAEAE3' },
  { step: '120', hex: '#DFDFD8' },
]

// ─── Spearmint Ramp Data ───────────────────────────────────────────────────────

const spearmintRamp = [
  { step: '0',   hex: '#ECFFF7' },
  { step: '10',  hex: '#D7FDEF' },
  { step: '20',  hex: '#A6FDE2' },
  { step: '30',  hex: '#50FBD4' },
  { step: '40',  hex: '#00EEC5' },
  { step: '50',  hex: '#00D5B0' },
  { step: '60',  hex: '#00B797' },
  { step: '70',  hex: '#00A286' },
  { step: '80',  hex: '#00856D' },
  { step: '90',  hex: '#006A56' },
  { step: '100', hex: '#005244' },
  { step: '110', hex: '#003E31' },
  { step: '120', hex: '#002B21' },
]

// ─── Pepper (Neutral) Ramp Data ────────────────────────────────────────────────

const pepperRamp = [
  { step: '0',   hex: '#F0F4F6' },
  { step: '10',  hex: '#E2E9ED' },
  { step: '20',  hex: '#D5DEE3' },
  { step: '30',  hex: '#C3CED5' },
  { step: '40',  hex: '#ADBAC2' },
  { step: '50',  hex: '#9AA7B0' },
  { step: '60',  hex: '#859299' },
  { step: '70',  hex: '#727E85' },
  { step: '80',  hex: '#5D686F' },
  { step: '90',  hex: '#4C555B' },
  { step: '100', hex: '#3C4348' },
  { step: '110', hex: '#2B3135' },
  { step: '120', hex: '#21262A', alias: 'ink' },
  { step: '130', hex: '#181C1F' },
]

const semanticTokens = [
  { name: 'background',  cssVar: '--background',  bgClass: 'bg-background' },
  { name: 'foreground',  cssVar: '--foreground',  bgClass: 'bg-foreground' },
  { name: 'card',        cssVar: '--card',        bgClass: 'bg-card',      bordered: true },
  { name: 'primary',     cssVar: '--primary',     bgClass: 'bg-primary' },
  { name: 'secondary',   cssVar: '--secondary',   bgClass: 'bg-secondary' },
  { name: 'muted',       cssVar: '--muted',       bgClass: 'bg-muted' },
  { name: 'accent',      cssVar: '--accent',      bgClass: 'bg-accent' },
  { name: 'border',      cssVar: '--border',      bgClass: 'bg-border' },
  { name: 'destructive', cssVar: '--destructive', bgClass: 'bg-destructive' },
]

// ─── Typography Data ───────────────────────────────────────────────────────────

const typeScale = [
  { label: 'Display',       classes: 'text-[clamp(3rem,8vw,7rem)] font-medium leading-none tracking-tight', sample: 'Work',                                                          weight: 500, size: 'clamp(48–112px)', usedIn: 'Homepage hero, About hero, Project hero titles' },
  { label: 'H1 · 5xl',     classes: 'text-5xl font-medium tracking-tight',   sample: 'Design that moves',                                                                            weight: 500, size: '48px',             usedIn: 'Section headings (lg), Stats values (md)' },
  { label: 'H2 · 4xl',     classes: 'text-4xl font-medium',                  sample: 'Brand Identity',                                                                                weight: 500, size: '36px',             usedIn: 'Section headings (md), Rich text H2' },
  { label: 'H3 · 3xl',     classes: 'text-3xl font-medium',                  sample: 'Motion & Interaction',                                                                          weight: 500, size: '30px',             usedIn: 'Rich text H2 (mobile)' },
  { label: 'H4 · 2xl',     classes: 'text-2xl font-medium',                  sample: 'Project Overview',                                                                              weight: 500, size: '24px',             usedIn: 'Nav mobile links, Rich text H3, Project hero description, About intro (md)' },
  { label: 'Body LG · xl', classes: 'text-xl text-foreground/80 leading-7', sample: 'We craft digital experiences that connect brands with people.',                             weight: 400, size: '20px',             usedIn: 'About intro, TextBlock body (md)' },
  { label: 'Body · base',  classes: 'text-base text-foreground/80 leading-relaxed', sample: 'We craft digital experiences that connect brands with people.',                           weight: 400, size: '16px',             usedIn: 'TextBlock body, ProjectCard title, Stats labels, Rich text paragraphs' },
  { label: 'Small · sm',   classes: 'text-sm text-foreground/60',                   sample: 'Brand Strategy · Visual Identity · Motion',                                               weight: 400, size: '14px',             usedIn: 'Nav links, Footer, ProjectCard year/client, Captions, Project hero metadata' },
  { label: 'Label · xs',   classes: 'text-xs uppercase tracking-widest font-medium text-coral', sample: 'View Project →',                                                             weight: 500, size: '12px',             usedIn: 'Tags, Section labels, Project metadata labels, Next project label' },
]

// ─── Button Data ───────────────────────────────────────────────────────────────

type BtnVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
type BtnSize    = 'xs' | 'sm' | 'default' | 'lg' | 'icon'

const BTN_VARIANTS: BtnVariant[] = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link']
const BTN_SIZES:    BtnSize[]    = ['xs', 'sm', 'default', 'lg', 'icon']

// ─── Sidebar nav ───────────────────────────────────────────────────────────────
// Add a new entry here whenever you add a new section below.

const NAV_SECTIONS = [
  { id: 'colors',     label: 'Colors' },
  { id: 'ramps',      label: 'Color Ramps' },
  { id: 'dark-mode',  label: 'Dark Mode' },
  { id: 'typography', label: 'Typography' },
  { id: 'button',     label: 'Button' },
  { id: 'media',      label: 'Media' },
  { id: 'grid',       label: 'Grid' },
  // { id: 'tag',     label: 'Tag' },
]

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-content mx-auto section-pad">

        <header className="pt-24 pb-16 border-b border-border">
          <p className="text-xs uppercase tracking-widest text-foreground/40 mb-3">Internal</p>
          <h1 className="text-[clamp(3rem,8vw,7rem)] font-medium leading-none tracking-tight text-foreground">
            Design System
          </h1>
        </header>

        <div className="flex gap-20 py-16">

          {/* Sticky sidebar nav */}
          <aside className="hidden lg:block w-40 shrink-0">
            <nav className="sticky top-24 space-y-1">
              {NAV_SECTIONS.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-foreground/40 hover:text-coral py-1.5 transition-colors duration-200"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <ColorsSection />
            <ColorRampsSection />
            <DarkModeSection />
            <TypographySection />
            <ButtonSection />
            <MediaSection />
            <GridSection />

            {/*
             * ── ADD NEW COMPONENTS BELOW ──────────────────────────────────────
             *
             * 1. Add an entry to NAV_SECTIONS at the top of this file
             * 2. Create a new section component following the pattern above
             * 3. Render it here
             *
             * Example:
             *   <TagSection />
             */}
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Colors ────────────────────────────────────────────────────────────────────

function ColorsSection() {
  return (
    <Section id="colors" title="Colors">

      <Subsection label="Primitive Tokens">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {primitives.map(t => (
            <div key={t.name}>
              <div
                className="h-28 rounded-sm flex items-end p-3 mb-3"
                style={{
                  backgroundColor: t.value,
                  border: t.bordered ? '1px solid var(--border)' : undefined,
                }}
              >
                <span className="text-xs font-mono" style={{ color: t.textColor }}>{t.value}</span>
              </div>
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-foreground/40 font-mono mt-0.5">--color-{t.name}</p>
              <p className="text-xs text-foreground/25 font-mono">bg-{t.name} · text-{t.name}</p>
            </div>
          ))}
        </div>
      </Subsection>

      <Subsection label="Semantic Tokens">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {semanticTokens.map(t => (
            <div key={t.name}>
              <div
                className={`h-16 rounded-sm mb-3 ${t.bgClass} ${t.bordered ? 'border border-border' : ''}`}
              />
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-foreground/40 font-mono mt-0.5">{t.cssVar}</p>
            </div>
          ))}
        </div>
      </Subsection>

    </Section>
  )
}

// ─── Color Ramps ───────────────────────────────────────────────────────────────

type RampStep = { step: string; hex: string; alias?: string }

const COLOR_RAMPS: { name: string; steps: RampStep[]; darkThreshold: number }[] = [
  { name: 'watermelon', steps: watermelonRamp, darkThreshold: 60 },
  { name: 'spearmint',  steps: spearmintRamp,  darkThreshold: 60 },
  { name: 'pepper',     steps: pepperRamp,     darkThreshold: 60 },
  { name: 'tofu',       steps: tofuRamp,       darkThreshold: 999 }, // all light
]

function ColorRampsSection() {
  return (
    <Section id="ramps" title="Color Ramps" meta="primitives / color ramps">
      <div className="space-y-16">
        {COLOR_RAMPS.map(ramp => (
          <Subsection key={ramp.name} label={ramp.name}>

            {/* Continuous bar */}
            <div className="flex h-10 rounded-sm overflow-hidden mb-6">
              {ramp.steps.map(s => (
                <div
                  key={s.step}
                  className="flex-1 h-full"
                  style={{ backgroundColor: s.hex }}
                  title={`${ramp.name}-${s.step} · ${s.hex}`}
                />
              ))}
            </div>

            {/* Step swatches */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
              {ramp.steps.map(s => {
                const isDark = parseInt(s.step, 10) >= ramp.darkThreshold
                const labelColor = isDark ? 'var(--color-cream)' : 'var(--color-ink)'
                return (
                  <div key={s.step}>
                    <div
                      className="h-16 rounded-sm mb-2 flex flex-col justify-end p-2"
                      style={{ backgroundColor: s.hex }}
                    >
                      <span className="text-[9px] font-mono leading-tight" style={{ color: labelColor }}>
                        {s.hex}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground leading-tight">
                      {s.step}
                      {s.alias && (
                        <span className="ml-1 text-coral text-[10px] font-mono">= {s.alias}</span>
                      )}
                    </p>
                    <p className="text-[10px] text-foreground/40 font-mono mt-0.5">{ramp.name}-{s.step}</p>
                  </div>
                )
              })}
            </div>

          </Subsection>
        ))}
      </div>
    </Section>
  )
}

// ─── Dark Mode ─────────────────────────────────────────────────────────────────

const darkTokens = [
  { token: '--background',   light: '#F4F4EF', dark: '#181C1F', note: 'cream → pepper-130' },
  { token: '--foreground',   light: '#21262A', dark: '#F4F4EF', note: 'ink → cream' },
  { token: '--card',         light: '#FFFFFF', dark: '#21262A', note: 'white → pepper-120' },
  { token: '--primary',      light: '#21262A', dark: '#F4F4EF', note: 'ink → cream (inverted)' },
  { token: '--secondary',    light: '#EAEAE5', dark: '#2B3135', note: 'muted warm → pepper-110' },
  { token: '--muted',        light: '#EAEAE5', dark: '#2B3135', note: 'muted warm → pepper-110' },
  { token: '--muted-foreground', light: '#6B7177', dark: '#727E85', note: '→ pepper-70' },
  { token: '--accent',       light: '#FF808C', dark: '#FF808C', note: 'coral — unchanged' },
  { token: '--border',       light: 'ink / 12%', dark: 'cream / 10%', note: 'opacity flip' },
]

function DarkModeSection() {
  const { theme, setTheme } = useTheme()

  return (
    <Section id="dark-mode" title="Dark Mode" meta="lib/theme.tsx · .dark class">

      {/* Toggle */}
      <div className="flex items-center gap-4 mb-12 p-6 rounded-sm border border-border bg-card">
        <ThemeToggle />
        <div>
          <p className="text-sm font-medium text-foreground">
            Currently <span className="text-coral font-mono">{theme}</span>
          </p>
          <p className="text-xs text-foreground/40 mt-0.5">
            Respects system preference on first visit · persisted to localStorage
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setTheme('light')}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors duration-150 ${
              theme === 'light'
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-foreground/50 hover:text-foreground'
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors duration-150 ${
              theme === 'dark'
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-foreground/50 hover:text-foreground'
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Token mapping table */}
      <Subsection label="Semantic Token Mapping">
        <div className="divide-y divide-border">
          {darkTokens.map(t => (
            <div key={t.token} className="grid grid-cols-[1fr_auto_auto] gap-6 items-center py-4">
              <div>
                <p className="text-xs font-mono text-foreground">{t.token}</p>
                <p className="text-[10px] text-foreground/40 mt-0.5">{t.note}</p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-6 rounded-sm border border-border shrink-0"
                  style={{ backgroundColor: t.light.startsWith('#') ? t.light : undefined }}
                  title={`Light: ${t.light}`}
                />
                <span className="text-[10px] font-mono text-foreground/50 w-20 text-right">{t.light}</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-6 rounded-sm border border-border shrink-0"
                  style={{ backgroundColor: t.dark.startsWith('#') ? t.dark : undefined, background: !t.dark.startsWith('#') ? `repeating-linear-gradient(45deg, var(--color-pepper-110) 0px, var(--color-pepper-110) 4px, var(--color-pepper-120) 4px, var(--color-pepper-120) 8px)` : undefined }}
                  title={`Dark: ${t.dark}`}
                />
                <span className="text-[10px] font-mono text-foreground/50 w-20 text-right">{t.dark}</span>
              </div>
            </div>
          ))}
        </div>
      </Subsection>

      {/* Side-by-side preview */}
      <Subsection label="Side by Side">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Light card */}
          <div className="rounded-sm overflow-hidden border border-border">
            <div className="px-4 py-2 bg-muted border-b border-border">
              <p className="text-xs uppercase tracking-widest text-foreground/40">Light</p>
            </div>
            <div className="p-6" style={{ backgroundColor: 'var(--color-tofu-100)' }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-watermelon-50)' }}>Studio</p>
              <p className="text-2xl font-medium mb-2" style={{ color: 'var(--color-pepper-120)' }}>Design that moves</p>
              <p className="text-sm mb-4" style={{ color: 'color-mix(in srgb, var(--color-pepper-120) 60%, transparent)' }}>We craft experiences that connect brands with people.</p>
              <div className="inline-flex px-4 py-2 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-pepper-120)', color: 'var(--color-tofu-100)' }}>
                View Work
              </div>
            </div>
          </div>
          {/* Dark card */}
          <div className="rounded-sm overflow-hidden border border-border">
            <div className="px-4 py-2 bg-muted border-b border-border">
              <p className="text-xs uppercase tracking-widest text-foreground/40">Dark</p>
            </div>
            <div className="p-6" style={{ backgroundColor: 'var(--color-pepper-130)' }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-watermelon-50)' }}>Studio</p>
              <p className="text-2xl font-medium mb-2" style={{ color: 'var(--color-tofu-100)' }}>Design that moves</p>
              <p className="text-sm mb-4" style={{ color: 'color-mix(in srgb, var(--color-tofu-100) 60%, transparent)' }}>We craft experiences that connect brands with people.</p>
              <div className="inline-flex px-4 py-2 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-tofu-100)', color: 'var(--color-pepper-120)' }}>
                View Work
              </div>
            </div>
          </div>
        </div>
      </Subsection>

    </Section>
  )
}

// ─── Typography ────────────────────────────────────────────────────────────────

function TypographySection() {
  return (
    <Section id="typography" title="Typography" meta="Avenir Next · 400 · 500">
      <div className="divide-y divide-border">
        {typeScale.map(item => (
          <div key={item.label} className="grid grid-cols-[160px_1fr] gap-8 items-baseline py-8">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-foreground/40 leading-relaxed">{item.label}</p>
              <p className="text-xs text-foreground/30 tabular-nums">{item.weight} · {item.size}</p>
            </div>
            <div className="space-y-2">
              <p className={item.classes}>{item.sample}</p>
              <p className="text-xs text-foreground/25 leading-relaxed">{item.usedIn}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── Button ────────────────────────────────────────────────────────────────────

function ButtonSection() {
  const [variant, setVariant] = useState<BtnVariant>('default')
  const [size, setSize]       = useState<BtnSize>('default')

  const codeStr = `<Button variant="${variant}"${size !== 'default' ? ` size="${size}"` : ''}>${
    size === 'icon' ? '→' : 'Label'
  }</Button>`

  return (
    <Section id="button" title="Button" meta="components/ui/button.tsx">

      {/* Interactive sandbox */}
      <div className="space-y-3 mb-12">
        <Controls>
          <ControlGroup label="Variant">
            {BTN_VARIANTS.map(v => (
              <Pill key={v} active={variant === v} onClick={() => setVariant(v)}>{v}</Pill>
            ))}
          </ControlGroup>
          <ControlGroup label="Size">
            {BTN_SIZES.map(s => (
              <Pill key={s} active={size === s} onClick={() => setSize(s)}>{s}</Pill>
            ))}
          </ControlGroup>
        </Controls>

        <Preview>
          <Button variant={variant} size={size}>
            {size === 'icon' ? '→' : 'Label'}
          </Button>
        </Preview>

        <Code>{codeStr}</Code>
      </div>

      {/* All variants */}
      <Subsection label="All Variants">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {BTN_VARIANTS.map(v => (
            <div key={v} className="space-y-3">
              <Preview compact>
                <Button variant={v}>Label</Button>
              </Preview>
              <p className="text-xs text-center text-foreground/40">{v}</p>
            </div>
          ))}
        </div>
      </Subsection>

      {/* All sizes */}
      <Subsection label="All Sizes">
        <Preview>
          <div className="flex items-end gap-6 flex-wrap">
            {BTN_SIZES.map(s => (
              <div key={s} className="flex flex-col items-center gap-3">
                <Button size={s}>{s === 'icon' ? '→' : 'Label'}</Button>
                <span className="text-xs text-foreground/40">{s}</span>
              </div>
            ))}
          </div>
        </Preview>
      </Subsection>

    </Section>
  )
}

// ─── Media ─────────────────────────────────────────────────────────────────────

const MEDIA_TYPES:   MediaType[]   = ['image', 'video', 'animation']
const MEDIA_RATIOS:  MediaRatio[]  = ['16/9', '4/3', '1/1', '3/2', '21/9', '9/16']
const MEDIA_LAYOUTS: MediaLayout[] = ['full-bleed', 'full-width', 'contained', 'thumbnail']

const LAYOUT_META: Record<MediaLayout, { widthPercent: number; desc: string; token: string; spacing: string }> = {
  'full-bleed': {
    widthPercent: 100,
    desc:    'Edge-to-edge. No padding. Ideal for hero moments.',
    token:   'w-full',
    spacing: 'no vertical padding',
  },
  'full-width': {
    widthPercent: 88,
    desc:    'Max-width 1400px with standard page padding.',
    token:   'max-w-content section-pad',
    spacing: 'py-8 md:py-16',
  },
  'contained': {
    widthPercent: 55,
    desc:    'Text column width (max-w-3xl) with page padding.',
    token:   'max-w-3xl px-6 md:px-24',
    spacing: 'py-8 md:py-12',
  },
  'thumbnail': {
    widthPercent: 22,
    desc:    'No wrapper or spacing. Drop into any grid.',
    token:   'no outer class',
    spacing: 'none',
  },
}

function MediaSection() {
  const [type,        setType]        = useState<MediaType>('image')
  const [ratio,       setRatio]       = useState<MediaRatio>('16/9')
  const [showCaption, setShowCaption] = useState(false)

  const codeLines = [
    '<Media',
    `  type="${type}"`,
    '  layout="contained"',
    `  aspectRatio="${ratio}"`,
    ...(showCaption ? ['  caption="A short description"'] : []),
    '  src="..."',
    '/>',
  ]

  return (
    <Section id="media" title="Media" meta="components/ui/media.tsx">

      {/* ── Interactive sandbox ──────────────────────────────────────────────── */}
      <div className="space-y-3 mb-12">
        <Controls>
          <ControlGroup label="Type">
            {MEDIA_TYPES.map(t => (
              <Pill key={t} active={type === t} onClick={() => setType(t)}>{t}</Pill>
            ))}
          </ControlGroup>

          <ControlGroup label="Aspect Ratio">
            {MEDIA_RATIOS.map(r => (
              <Pill key={r} active={ratio === r} onClick={() => setRatio(r)}>{r}</Pill>
            ))}
          </ControlGroup>

          <ControlGroup label="Caption">
            <Pill active={showCaption} onClick={() => setShowCaption(v => !v)}>Show</Pill>
          </ControlGroup>
        </Controls>

        <Preview>
          <div className="w-full max-w-md mx-auto">
            <Media
              type={type}
              layout="thumbnail"
              aspectRatio={ratio}
              caption={showCaption ? 'A short description of this media item.' : undefined}
              animate={false}
            />
          </div>
        </Preview>

        <Code>{codeLines.join('\n')}</Code>
      </div>

      {/* ── Layout Variants ──────────────────────────────────────────────────── */}
      <Subsection label="Layout Variants">
        <div className="space-y-3">
          {MEDIA_LAYOUTS.map(layout => {
            const { widthPercent, desc, token, spacing } = LAYOUT_META[layout]
            return (
              <div key={layout} className="p-5 rounded-sm border border-border bg-card">
                {/* Visual width bar */}
                <div className="relative h-8 rounded-sm overflow-hidden bg-secondary mb-4">
                  {/* filled region = media width */}
                  <div
                    className="absolute inset-y-0 left-0 bg-muted-foreground/20 flex items-center"
                    style={{ width: `${widthPercent}%` }}
                  >
                    <div className="absolute right-0 inset-y-0 w-0.5 bg-coral" />
                  </div>
                  {/* label inside bar */}
                  <span className="absolute inset-0 flex items-center px-3 text-[10px] font-mono text-foreground/40 uppercase tracking-widest select-none">
                    {widthPercent}% of container
                  </span>
                </div>

                {/* Meta row */}
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground mb-0.5">{layout}</p>
                    <p className="text-xs text-foreground/50">{desc}</p>
                  </div>
                  <div className="shrink-0 text-right space-y-0.5">
                    <p className="text-[10px] font-mono text-foreground/30">{token}</p>
                    <p className="text-[10px] font-mono text-foreground/25">{spacing}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Subsection>

      {/* ── Aspect Ratios ────────────────────────────────────────────────────── */}
      <Subsection label="Aspect Ratios">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {MEDIA_RATIOS.map(r => (
            <div key={r} className="space-y-2">
              <Media type="image" layout="thumbnail" aspectRatio={r} animate={false} />
              <p className="text-[10px] font-mono text-foreground/40 text-center">{r}</p>
            </div>
          ))}
        </div>
      </Subsection>

      {/* ── Thumbnail Grid ───────────────────────────────────────────────────── */}
      <Subsection label="Thumbnail Grid  ·  2-col / 3-col">
        <div className="space-y-6">

          {/* 2-col */}
          <div>
            <p className="text-[10px] font-mono text-foreground/30 mb-3 uppercase tracking-widest">grid-cols-2</p>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1].map(i => (
                <Media key={i} type="image" layout="thumbnail" aspectRatio="4/3" animate={false} />
              ))}
            </div>
          </div>

          {/* 3-col */}
          <div>
            <p className="text-[10px] font-mono text-foreground/30 mb-3 uppercase tracking-widest">grid-cols-3</p>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map(i => (
                <Media key={i} type="image" layout="thumbnail" aspectRatio="4/3" animate={false} />
              ))}
            </div>
          </div>

          {/* Mixed: 1 featured + 2 thumbnails */}
          <div>
            <p className="text-[10px] font-mono text-foreground/30 mb-3 uppercase tracking-widest">featured + 2-col</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Media type="image" layout="thumbnail" aspectRatio="21/9" animate={false} />
              </div>
              {[0, 1].map(i => (
                <Media key={i} type="image" layout="thumbnail" aspectRatio="4/3" animate={false} />
              ))}
            </div>
          </div>

        </div>
      </Subsection>

    </Section>
  )
}

// ─── Grid ──────────────────────────────────────────────────────────────────────

const COL_OPTIONS = [1, 2, 3, 4, 6, 12] as const
type ColOption = (typeof COL_OPTIONS)[number]

// Static class map — ensures Tailwind includes every class at build time
const COLS_CLASS: Record<ColOption, string> = {
  1:  'grid-cols-1',
  2:  'grid-cols-2',
  3:  'grid-cols-3',
  4:  'grid-cols-4',
  6:  'grid-cols-6',
  12: 'grid-cols-12',
}

const GAP_OPTIONS = [
  { label: 'gap-2',  class: 'gap-2',  px: '8px'  },
  { label: 'gap-4',  class: 'gap-4',  px: '16px' },
  { label: 'gap-6',  class: 'gap-6',  px: '24px' },
  { label: 'gap-8',  class: 'gap-8',  px: '32px' },
  { label: 'gap-12', class: 'gap-12', px: '48px' },
  { label: 'gap-16', class: 'gap-16', px: '64px' },
  { label: 'gap-20', class: 'gap-20', px: '80px' },
] as const

// Named grid patterns actually used on this site
const GRID_PATTERNS = [
  {
    name:    'Project Grid',
    usage:   'app/page.tsx',
    desc:    '1-col mobile → 2-col desktop. Asymmetric gap: tight horizontal, generous vertical.',
    classes: 'grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20',
    preview: { cols: 'grid-cols-2', gap: 'gap-x-6 gap-y-10', items: 4 },
  },
  {
    name:    'Content Split',
    usage:   'app/projects/[slug]/page.tsx',
    desc:    'Equal halves — stacks on mobile, side-by-side on large screens.',
    classes: 'grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24',
    preview: { cols: 'grid-cols-2', gap: 'gap-8', items: 2 },
  },
  {
    name:    'Gallery · 3-col',
    usage:   'GalleryBlock  columns: 3',
    desc:    'Dense editorial grid. Tight gap groups images together.',
    classes: 'grid grid-cols-3 gap-4',
    preview: { cols: 'grid-cols-3', gap: 'gap-3', items: 6 },
  },
  {
    name:    'Gallery · 4-col',
    usage:   'GalleryBlock  columns: 4',
    desc:    '2-col on mobile, collapses to 4-col on desktop.',
    classes: 'grid grid-cols-2 md:grid-cols-4 gap-4',
    preview: { cols: 'grid-cols-4', gap: 'gap-3', items: 8 },
  },
]

// Column-span reference on a 12-col base grid
const SPAN_EXAMPLES = [
  { label: 'col-span-12', class: 'col-span-12', span: 12, desc: 'Full width' },
  { label: 'col-span-8',  class: 'col-span-8',  span: 8,  desc: '⅔ width'   },
  { label: 'col-span-6',  class: 'col-span-6',  span: 6,  desc: '½ width'   },
  { label: 'col-span-4',  class: 'col-span-4',  span: 4,  desc: '⅓ width'   },
  { label: 'col-span-3',  class: 'col-span-3',  span: 3,  desc: '¼ width'   },
]

function GridSection() {
  const [cols,     setCols]     = useState<ColOption>(3)
  const [gapIndex, setGapIndex] = useState(2) // gap-6 default

  const gap    = GAP_OPTIONS[gapIndex]
  const count  = Math.min(cols, 12)
  const codeStr = [
    `<div className="grid ${COLS_CLASS[cols]} ${gap.class}">`,
    `  {items.map(item => (`,
    `    <div key={item.id}>…</div>`,
    `  ))}`,
    `</div>`,
  ].join('\n')

  return (
    <Section id="grid" title="Grid" meta="Tailwind CSS grid utilities">

      {/* ── Interactive sandbox ─────────────────────────────────────────────── */}
      <div className="space-y-3 mb-12">
        <Controls>
          <ControlGroup label="Columns">
            {COL_OPTIONS.map(c => (
              <Pill key={c} active={cols === c} onClick={() => setCols(c)}>{c}</Pill>
            ))}
          </ControlGroup>
          <ControlGroup label="Gap">
            {GAP_OPTIONS.map((g, i) => (
              <Pill key={g.label} active={gapIndex === i} onClick={() => setGapIndex(i)}>{g.label}</Pill>
            ))}
          </ControlGroup>
        </Controls>

        <Preview>
          <div className={`w-full grid ${COLS_CLASS[cols]} ${gap.class}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="bg-muted rounded-sm h-12 flex items-center justify-center">
                <span className="text-[10px] font-mono text-foreground/30">{i + 1}</span>
              </div>
            ))}
          </div>
        </Preview>

        <Code>{codeStr}</Code>
      </div>

      {/* ── Gap Scale ───────────────────────────────────────────────────────── */}
      <Subsection label="Gap Scale">
        <div className="space-y-2.5">
          {GAP_OPTIONS.map(g => (
            <div key={g.label} className="flex items-center gap-6">
              {/* visual ruler bar */}
              <div className="relative flex-1 h-7 bg-secondary rounded-sm overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-coral/15 border-r-2 border-coral/60"
                  style={{ width: g.px }}
                />
              </div>
              <div className="shrink-0 flex items-baseline gap-2 w-28 justify-end">
                <span className="text-xs font-mono text-foreground">{g.label}</span>
                <span className="text-[10px] font-mono text-foreground/30">{g.px}</span>
              </div>
            </div>
          ))}
        </div>
      </Subsection>

      {/* ── Named Patterns ──────────────────────────────────────────────────── */}
      <Subsection label="Named Patterns">
        <div className="space-y-4">
          {GRID_PATTERNS.map(p => (
            <div key={p.name} className="rounded-sm border border-border overflow-hidden">
              {/* header */}
              <div className="px-5 py-3 bg-card border-b border-border flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                  <span className="text-[10px] font-mono text-foreground/30">{p.usage}</span>
                </div>
                <p className="text-xs text-foreground/40">{p.desc}</p>
              </div>
              {/* live preview */}
              <div className="p-5 bg-background">
                <div className={`grid ${p.preview.cols} ${p.preview.gap}`}>
                  {Array.from({ length: p.preview.items }).map((_, i) => (
                    <div key={i} className="bg-muted rounded-sm h-10 flex items-center justify-center">
                      <span className="text-[9px] font-mono text-foreground/25">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* code */}
              <div className="px-5 py-3 bg-ink border-t border-white/5">
                <code className="text-[11px] font-mono text-cream/50">{p.classes}</code>
              </div>
            </div>
          ))}
        </div>
      </Subsection>

      {/* ── Column Spans · 12-col base ──────────────────────────────────────── */}
      <Subsection label="Column Spans  ·  12-column base">
        <div className="space-y-4">
          {SPAN_EXAMPLES.map(s => (
            <div key={s.label}>
              <div className="grid grid-cols-12 gap-1 mb-1">
                {/* highlighted span */}
                <div className={`${s.class} bg-coral/15 border border-coral/30 rounded-sm h-8 flex items-center justify-center`}>
                  <span className="text-[10px] font-mono text-coral">{s.label}</span>
                </div>
                {/* remaining unfilled cols */}
                {Array.from({ length: 12 - s.span }).map((_, i) => (
                  <div key={i} className="col-span-1 bg-secondary rounded-sm h-8" />
                ))}
              </div>
              <p className="text-[10px] font-mono text-foreground/30">{s.desc}  ·  {s.span} / 12 columns</p>
            </div>
          ))}
        </div>
      </Subsection>

    </Section>
  )
}

// ─── Shared layout primitives ──────────────────────────────────────────────────

function Section({
  id,
  title,
  meta,
  children,
}: {
  id: string
  title: string
  meta?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="py-16 border-b border-border scroll-mt-24">
      <div className="mb-10">
        <h2 className="text-2xl font-medium text-foreground">{title}</h2>
        {meta && <p className="text-xs uppercase tracking-widest text-foreground/40 font-mono mt-1">{meta}</p>}
      </div>
      {children}
    </section>
  )
}

function Subsection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-12">
      <p className="text-xs uppercase tracking-widest text-foreground/40 mb-6">{label}</p>
      {children}
    </div>
  )
}

function Preview({ children, compact }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <div className={`flex items-center justify-center bg-card border border-border rounded-sm ${compact ? 'px-4 py-6' : 'px-8 py-12'}`}>
      {children}
    </div>
  )
}

function Controls({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-8">{children}</div>
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-foreground/40">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-full border transition-colors duration-150 ${
        active
          ? 'bg-foreground text-background border-foreground'
          : 'border-border text-foreground/50 hover:text-foreground hover:border-foreground/40'
      }`}
    >
      {children}
    </button>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-4 bg-ink rounded-sm overflow-x-auto">
      <code className="text-xs font-mono text-cream/60 whitespace-pre">{children}</code>
    </div>
  )
}
