'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'colors' | 'grid' | 'type' | 'space'

interface DS {
  colorBackground: string
  colorForeground: string
  colorAccent: string
  colorCard: string
  gridCols: number
  gridColGap: number   // stored as 10× rem (e.g. 30 = 3rem)
  gridRowGap: number
  baseFontSize: number // px
  bodyWeight: 400 | 500
  headingWeight: 400 | 500
  sectionPadX: number  // stored as 10× rem
}

const DEFAULTS: DS = {
  colorBackground: '#F4F4EF',
  colorForeground: '#21262A',
  colorAccent: '#FF808C',
  colorCard: '#FFFFFF',
  gridCols: 2,
  gridColGap: 30,
  gridRowGap: 50,
  baseFontSize: 16,
  bodyWeight: 400,
  headingWeight: 500,
  sectionPadX: 45,
}

const STORAGE_KEY = 'dp-v1'

// ─── Color ramps ─────────────────────────────────────────────────────────────

type Swatch = { stop: string; hex: string }

const RAMPS: Record<string, Swatch[]> = {
  Watermelon: [
    { stop: '0',   hex: '#FFF6F6' }, { stop: '10',  hex: '#FFE7E7' },
    { stop: '20',  hex: '#FFD4D8' }, { stop: '30',  hex: '#FFB8BE' },
    { stop: '40',  hex: '#FF9BA4' }, { stop: '50',  hex: '#FF808C' },
    { stop: '60',  hex: '#F7576C' }, { stop: '70',  hex: '#DB334D' },
    { stop: '80',  hex: '#B61A37' }, { stop: '90',  hex: '#8F1229' },
    { stop: '100', hex: '#6E0B1E' }, { stop: '110', hex: '#4F0513' },
    { stop: '120', hex: '#40030E' },
  ],
  Tofu: [
    { stop: '100', hex: '#F4F4EF' },
    { stop: '110', hex: '#EAEAE3' },
    { stop: '120', hex: '#DFDFD8' },
  ],
  Spearmint: [
    { stop: '0',   hex: '#ECFFF7' }, { stop: '10',  hex: '#D7FDEF' },
    { stop: '20',  hex: '#A6FDE2' }, { stop: '30',  hex: '#50FBD4' },
    { stop: '40',  hex: '#00EEC5' }, { stop: '50',  hex: '#00D5B0' },
    { stop: '60',  hex: '#00B797' }, { stop: '70',  hex: '#00A286' },
    { stop: '80',  hex: '#00856D' }, { stop: '90',  hex: '#006A56' },
    { stop: '100', hex: '#005244' }, { stop: '110', hex: '#003E31' },
    { stop: '120', hex: '#002B21' },
  ],
  Pepper: [
    { stop: '0',   hex: '#F0F4F6' }, { stop: '10',  hex: '#E2E9ED' },
    { stop: '20',  hex: '#D5DEE3' }, { stop: '30',  hex: '#C3CED5' },
    { stop: '40',  hex: '#ADBAC2' }, { stop: '50',  hex: '#9AA7B0' },
    { stop: '60',  hex: '#859299' }, { stop: '70',  hex: '#727E85' },
    { stop: '80',  hex: '#5D686F' }, { stop: '90',  hex: '#4C555B' },
    { stop: '100', hex: '#3C4348' }, { stop: '110', hex: '#2B3135' },
    { stop: '120', hex: '#21262A' }, { stop: '130', hex: '#181C1F' },
  ],
}

// ─── CSS generation ───────────────────────────────────────────────────────────

function buildCSS(s: DS): string {
  // Layout / type tokens apply globally via :root.
  // Color tokens are scoped to :root (light) and .dark so the theme toggle
  // continues to work when the design panel is active.
  return `
    :root:not(.dark) {
      --background: ${s.colorBackground};
      --foreground: ${s.colorForeground};
      --card: ${s.colorCard};
      --card-foreground: ${s.colorForeground};
      --popover: ${s.colorCard};
      --popover-foreground: ${s.colorForeground};
      --accent: ${s.colorAccent};
      --ring: ${s.colorAccent};
    }
    :root {
      --dp-grid-cols: ${s.gridCols};
      --dp-col-gap: ${s.gridColGap / 10}rem;
      --dp-row-gap: ${s.gridRowGap / 10}rem;
      --dp-section-px: ${s.sectionPadX / 10}rem;
    }
    html { font-size: ${s.baseFontSize}px; }
    body, p, span, a, li, td { font-weight: ${s.bodyWeight}; }
    h1, h2, h3, h4, h5, h6 { font-weight: ${s.headingWeight} !important; }
  `
}

function injectCSS(css: string) {
  let el = document.getElementById('__dp') as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = '__dp'
    document.head.appendChild(el)
  }
  el.textContent = css
}

function removeCSS() {
  document.getElementById('__dp')?.remove()
}

// ─── Sub-components ──────────────────────────────────────────────────────────

// All panel sub-components use locked neutral styles (not CSS vars) so the
// panel remains readable regardless of what colors the user has set.

const P = {
  bg: '#FFFFFF',
  fg: '#21262A',
  muted: '#6B7177',
  border: 'rgba(33,38,42,0.12)',
  accent: '#FF808C',
  subtle: '#F4F4EF',
} as const

function SliderRow({
  label, value, min, max, step = 1,
  format = String,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  format?: (v: number) => string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: P.muted }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: P.fg, fontVariantNumeric: 'tabular-nums' }}>
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: P.accent, cursor: 'pointer', display: 'block' }}
      />
    </div>
  )
}

function WeightToggle({
  label, value, onChange,
}: {
  label: string
  value: 400 | 500
  onChange: (v: 400 | 500) => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 11, color: P.muted }}>{label}</span>
      <div style={{
        display: 'flex',
        border: `1px solid ${P.border}`,
        borderRadius: 6,
        overflow: 'hidden',
      }}>
        {([400, 500] as const).map(w => (
          <button
            key={w}
            onClick={() => onChange(w)}
            style={{
              padding: '4px 12px',
              fontSize: 11,
              fontWeight: w,
              background: value === w ? P.fg : 'transparent',
              color: value === w ? P.bg : P.muted,
              border: 'none',
              cursor: 'pointer',
              transition: 'background 150ms, color 150ms',
            }}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  )
}

function ColorPicker({
  label, value, onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: P.muted }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, color: P.muted, fontFamily: 'monospace' }}>{value}</span>
          <div style={{
            width: 16, height: 16, borderRadius: 4,
            background: value,
            border: `1px solid ${P.border}`,
            flexShrink: 0,
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {Object.entries(RAMPS).map(([rampName, swatches]) => (
          <div key={rampName}>
            <div style={{
              fontSize: 9, color: P.muted, marginBottom: 3,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {rampName}
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {swatches.map(({ hex, stop }) => (
                <button
                  key={hex}
                  title={`${rampName}-${stop}`}
                  onClick={() => onChange(hex)}
                  style={{
                    flex: 1,
                    height: 18,
                    background: hex,
                    border: value === hex
                      ? `2px solid ${P.fg}`
                      : '1px solid transparent',
                    borderRadius: 2,
                    cursor: 'pointer',
                    padding: 0,
                    outline: 'none',
                    transition: 'border-color 80ms',
                    boxSizing: 'border-box',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function DesignPanel() {
  const [open, setOpen]         = useState(false)
  const [tab, setTab]           = useState<Tab>('colors')
  const [s, setS]               = useState<DS>(DEFAULTS)
  const [modified, setModified] = useState(false)

  // Restore saved settings on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as DS
        setS(saved)
        injectCSS(buildCSS(saved))
        setModified(JSON.stringify(saved) !== JSON.stringify(DEFAULTS))
      }
    } catch { /* ignore */ }
  }, [])

  const update = useCallback((patch: Partial<DS>) => {
    setS(prev => {
      const next = { ...prev, ...patch }
      injectCSS(buildCSS(next))
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      setModified(JSON.stringify(next) !== JSON.stringify(DEFAULTS))
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setS(DEFAULTS)
    removeCSS()
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    setModified(false)
  }, [])

  // ⌘⇧D / Ctrl⇧D keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const TABS: { id: Tab; label: string }[] = [
    { id: 'colors', label: 'Colors' },
    { id: 'grid',   label: 'Grid' },
    { id: 'type',   label: 'Type' },
    { id: 'space',  label: 'Space' },
  ]

  return (
    <>
      {/* Trigger pill */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Design Panel (⌘⇧D)"
        style={{
          position: 'fixed',
          bottom: 32,
          right: open ? 360 : 0,
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '9px 12px 9px 10px',
          background: modified ? P.accent : P.bg,
          color: modified ? '#fff' : P.fg,
          border: `1px solid ${P.border}`,
          borderRight: 'none',
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          cursor: 'pointer',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.04em',
          fontFamily: 'inherit',
          boxShadow: '-2px 2px 12px rgba(0,0,0,0.08)',
          transition: 'right 250ms cubic-bezier(0.4,0,0.2,1), background 200ms, color 200ms',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Sliders icon */}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6"/>
          <line x1="8" y1="6" x2="8" y2="3"/>
          <line x1="8" y1="6" x2="8" y2="9"/>
          <line x1="4" y1="12" x2="20" y2="12"/>
          <line x1="16" y1="12" x2="16" y2="9"/>
          <line x1="16" y1="12" x2="16" y2="15"/>
          <line x1="4" y1="18" x2="20" y2="18"/>
          <line x1="12" y1="18" x2="12" y2="15"/>
          <line x1="12" y1="18" x2="12" y2="21"/>
        </svg>
        Design
        {modified && (
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#fff',
            display: 'inline-block',
            marginLeft: 2,
            opacity: 0.8,
          }} />
        )}
      </button>

      {/* Panel */}
      <div
        aria-label="Design Panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 360,
          transform: `translateX(${open ? '0' : '100%'})`,
          transition: 'transform 250ms cubic-bezier(0.4,0,0.2,1)',
          zIndex: 9999,
          background: P.bg,
          borderLeft: `1px solid ${P.border}`,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--font-avenir, "Helvetica Neue", Arial, sans-serif)',
          boxShadow: '-4px 0 32px rgba(0,0,0,0.10)',
          color: P.fg,
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderBottom: `1px solid ${P.border}`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Design Panel</span>
            <span style={{ fontSize: 10, color: P.muted, letterSpacing: '0.03em' }}>⌘⇧D</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {modified && (
              <button
                onClick={reset}
                style={{
                  fontSize: 11,
                  color: P.accent,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  padding: 0,
                }}
              >
                Reset
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              style={{
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: `1px solid ${P.border}`,
                borderRadius: 6,
                cursor: 'pointer',
                color: P.muted,
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${P.border}`,
          flexShrink: 0,
        }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: 11,
                fontWeight: tab === t.id ? 500 : 400,
                color: tab === t.id ? P.fg : P.muted,
                background: 'none',
                border: 'none',
                borderBottom: tab === t.id ? `2px solid ${P.accent}` : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.02em',
                transition: 'color 150ms, border-color 150ms',
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {/* ── Colors ── */}
          {tab === 'colors' && (
            <div>
              <ColorPicker
                label="Background"
                value={s.colorBackground}
                onChange={hex => update({ colorBackground: hex })}
              />
              <ColorPicker
                label="Text / Foreground"
                value={s.colorForeground}
                onChange={hex => update({ colorForeground: hex })}
              />
              <ColorPicker
                label="Accent"
                value={s.colorAccent}
                onChange={hex => update({ colorAccent: hex })}
              />
              <ColorPicker
                label="Card / Surface"
                value={s.colorCard}
                onChange={hex => update({ colorCard: hex })}
              />
            </div>
          )}

          {/* ── Grid ── */}
          {tab === 'grid' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: P.muted, marginBottom: 8 }}>Desktop Columns</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4].map(n => (
                    <button
                      key={n}
                      onClick={() => update({ gridCols: n })}
                      style={{
                        flex: 1,
                        height: 40,
                        display: 'flex',
                        alignItems: 'stretch',
                        gap: 3,
                        padding: 7,
                        background: s.gridCols === n ? P.fg : P.subtle,
                        borderRadius: 6,
                        border: `1px solid ${s.gridCols === n ? P.fg : P.border}`,
                        cursor: 'pointer',
                        transition: 'background 150ms, border-color 150ms',
                      }}
                    >
                      {Array.from({ length: n }).map((_, i) => (
                        <div key={i} style={{
                          flex: 1,
                          background: s.gridCols === n ? P.bg : P.muted,
                          borderRadius: 2,
                          opacity: s.gridCols === n ? 0.6 : 0.35,
                        }} />
                      ))}
                    </button>
                  ))}
                </div>
              </div>

              <SliderRow
                label="Column Gap"
                value={s.gridColGap}
                min={0}
                max={80}
                step={5}
                format={v => `${v / 10}rem`}
                onChange={v => update({ gridColGap: v })}
              />

              <SliderRow
                label="Row Gap"
                value={s.gridRowGap}
                min={0}
                max={120}
                step={5}
                format={v => `${v / 10}rem`}
                onChange={v => update({ gridRowGap: v })}
              />

              {/* Live mini-preview */}
              <div>
                <div style={{
                  fontSize: 9, color: P.muted, marginBottom: 8,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  Preview
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${s.gridCols}, 1fr)`,
                  columnGap: `${(s.gridColGap / 10) * 4}px`,
                  rowGap: `${(s.gridRowGap / 10) * 3}px`,
                  padding: 10,
                  background: P.subtle,
                  borderRadius: 8,
                  border: `1px solid ${P.border}`,
                }}>
                  {Array.from({ length: Math.min(s.gridCols * 2, 8) }).map((_, i) => (
                    <div key={i} style={{
                      aspectRatio: '4/3',
                      background: P.accent,
                      opacity: 0.2 + (i % 4) * 0.08,
                      borderRadius: 4,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Type ── */}
          {tab === 'type' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <SliderRow
                label="Base Font Size"
                value={s.baseFontSize}
                min={12}
                max={20}
                format={v => `${v}px`}
                onChange={v => update({ baseFontSize: v })}
              />

              <WeightToggle
                label="Body Weight"
                value={s.bodyWeight}
                onChange={v => update({ bodyWeight: v })}
              />

              <WeightToggle
                label="Heading Weight"
                value={s.headingWeight}
                onChange={v => update({ headingWeight: v })}
              />

              {/* Type preview */}
              <div>
                <div style={{
                  fontSize: 9, color: P.muted, marginBottom: 8,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  Preview
                </div>
                <div style={{
                  padding: 16,
                  background: P.subtle,
                  borderRadius: 8,
                  border: `1px solid ${P.border}`,
                }}>
                  <div style={{
                    fontSize: s.baseFontSize * 2.5,
                    fontWeight: s.headingWeight,
                    color: P.fg,
                    lineHeight: 1.05,
                    marginBottom: 8,
                    letterSpacing: '-0.02em',
                  }}>
                    Heading
                  </div>
                  <div style={{
                    fontSize: s.baseFontSize,
                    fontWeight: s.bodyWeight,
                    color: P.muted,
                    lineHeight: 1.6,
                  }}>
                    Body copy at {s.baseFontSize}px,{' '}
                    weight {s.bodyWeight}. The quick brown fox.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Space ── */}
          {tab === 'space' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <SliderRow
                label="Section Padding X"
                value={s.sectionPadX}
                min={10}
                max={120}
                step={5}
                format={v => `${v / 10}rem`}
                onChange={v => update({ sectionPadX: v })}
              />

              {/* Padding preview */}
              <div>
                <div style={{
                  fontSize: 9, color: P.muted, marginBottom: 8,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  Preview
                </div>
                <div style={{
                  background: P.subtle,
                  borderRadius: 8,
                  border: `1px solid ${P.border}`,
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  {/* Padding indicators */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, bottom: 0,
                    width: `${Math.max((s.sectionPadX / 120) * 60, 4)}%`,
                    background: `${P.accent}18`,
                    borderRight: `1px dashed ${P.accent}60`,
                    pointerEvents: 'none',
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: 0, right: 0, bottom: 0,
                    width: `${Math.max((s.sectionPadX / 120) * 60, 4)}%`,
                    background: `${P.accent}18`,
                    borderLeft: `1px dashed ${P.accent}60`,
                    pointerEvents: 'none',
                  }} />
                  <div style={{ padding: '20px 0' }}>
                    <div style={{
                      margin: '0 auto',
                      width: `${Math.max(100 - (s.sectionPadX / 120) * 120, 20)}%`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}>
                      <div style={{ height: 8, background: P.fg, borderRadius: 4, opacity: 0.8, width: '70%' }} />
                      <div style={{ height: 6, background: P.muted, borderRadius: 3, opacity: 0.4, width: '50%' }} />
                      <div style={{ height: 6, background: P.muted, borderRadius: 3, opacity: 0.3, width: '60%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '10px 12px',
                background: P.subtle,
                borderRadius: 6,
                border: `1px solid ${P.border}`,
                fontSize: 10,
                color: P.muted,
                lineHeight: 1.6,
              }}>
                Add{' '}
                <code style={{
                  fontFamily: 'monospace',
                  background: P.border,
                  padding: '1px 5px',
                  borderRadius: 3,
                }}>
                  section-pad
                </code>{' '}
                to any element to apply the padding X variable.
                Already applied to the homepage sections.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
