# Design Team Portfolio — Claude Code Instructions

## Dev Server
Always start the dev server at the beginning of every conversation using `preview_start`. The server runs via the launch configuration in `.claude/launch.json` (uses Cursor's bundled Node.js). Verify it's running before making any code changes.

## Project Overview
A portfolio website for a design team. Built with Next.js 14 (App Router), Tailwind CSS, Shadcn/ui, and Sanity.io as the CMS. Hosted on Vercel.

---

## Design System

### Colors
Always use the design token names, never raw hex values in components.

| Token | Value | Usage |
|---|---|---|
| `cream` | `#F4F4EF` | Page backgrounds, light surfaces |
| `ink` | `#21262A` | Body text, headings, dark surfaces |
| `coral` | `#FF808C` | Accents, hover states, highlights |
| `white` | `#FFFFFF` | Cards, overlays |

### Typography
- **Font family**: `Avenir Next` (loaded via next/font or @font-face)
- **Weights in use**: 400 (Regular), 500 (Medium) only — do not use other weights
- **Scale**: Use Tailwind's type scale. Headings are large and confident. Body is comfortable, not tight.
- **Style**: No italic. No decorative fonts. Typography does the heavy lifting.

### Spacing & Layout
- Max content width: `1400px`, centered
- Generous padding: minimum `px-6 md:px-12 lg:px-24` on sections
- Lots of vertical whitespace between sections — never cramped
- Images go big: full-bleed or near full-width whenever possible
- Grid: 12-column base. Projects grid is typically 2-col on desktop, 1-col on mobile.

### Vibe Reference
Sites to reference for tone and layout decisions:
- instrument.com/work/oura-app — editorial hierarchy, progressive disclosure
- portorocha.com/robinhood-market — restrained, luxurious whitespace
- buck.co/work/turbotax — full-bleed media moments, strong visual pacing
- studiodumbar.com/work/openai — clean structure, confident typography
- dixonbaxi.com/case-study/espn — bold imagery, minimal UI chrome

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 App Router |
| Styling | Tailwind CSS + CSS variables |
| Components | Shadcn/ui (customized to design system) |
| CMS | Sanity.io v3 |
| Animations | Framer Motion |
| Hosting | Vercel |

---

## File & Folder Conventions

```
/app                      # Next.js App Router pages
  /page.tsx               # Homepage (project grid)
  /projects/[slug]/       # Dynamic project pages
  /about/                 # Team page
/components
  /ui/                    # Design system primitives (Button, Tag, etc.)
  /blocks/                # Sanity content block renderers
    /RichTextBlock.tsx
    /ImageBlock.tsx
    /VideoBlock.tsx
    /AnimationBlock.tsx
    /GalleryBlock.tsx
  /layout/                # Nav, Footer, PageWrapper
/lib
  /sanity/
    /client.ts            # Sanity client config
    /queries.ts           # GROQ queries
    /types.ts             # TypeScript types for Sanity schemas
/sanity
  /schemas/               # All Sanity content schemas live here
    /project.ts
    /blocks/
/styles
  /globals.css            # CSS variables, base styles
```

---

## Sanity CMS Rules

- All new content types go in `/sanity/schemas/`
- All new block types go in `/sanity/schemas/blocks/` AND get a corresponding renderer in `/components/blocks/`
- Slugs are always auto-generated from the title
- Every project must have: `title`, `slug`, `coverImage`, `tags`, `year`, `description`, `contentBlocks[]`
- Never hardcode content in components — it always comes from Sanity

---

## Component Rules

- Shadcn/ui components must be restyled to match the design system — override their defaults in `globals.css` or via `className`
- No drop shadows heavier than `shadow-sm` — use borders and spacing for separation instead
- Hover states: use opacity changes or color shifts to `coral`, no scale transforms on text elements
- Images: always use `next/image` with proper `sizes` and `priority` on above-the-fold images
- No loaders/spinners visible to users — use `loading="eager"` or Suspense with skeleton states that match layout

---

## Performance Rules

- All images served via Sanity's image pipeline with `?auto=format&fit=max`
- Videos: lazy load, never autoplay with sound
- No layout shift — always provide image dimensions or use `fill` with a sized container
- Target Lighthouse score: 90+ on all pages

---

## Do Nots

- Do not use Inter, Roboto, or system-ui as fonts
- Do not add purple gradients or generic AI-aesthetic styling
- Do not add components not in the design system without asking
- Do not use `<form>` HTML tags — use controlled inputs with React state
- Do not commit `.env.local` or Sanity tokens
