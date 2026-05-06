# Contributing to Spring

This is the design team portfolio site. It's built with Next.js 14, Tailwind CSS, Shadcn/ui, and Sanity.io — hosted on Vercel.

---

## First-time setup

### 1. Get access
Before you can work locally, you'll need Feliks to:
- Add you as a **collaborator** on the GitHub repo (`github.com/felixElOso/Spring` → Settings → Collaborators)
- Add you as a **member** on the Sanity project (`sanity.io/manage` → Design Portfolio → Members)
- Add you to the **Vercel project** (optional, only needed if you want to trigger deploys manually)

### 2. Clone the repo
```bash
git clone https://github.com/felixElOso/Spring.git
cd Spring
```

### 3. Install dependencies
```bash
npm install
```

### 4. Set up environment variables
Copy the example env file and fill in your values:
```bash
cp .env.example .env.local
```

Then open `.env.local` and:
- The `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are already correct — leave them as-is
- Generate a personal `SANITY_API_TOKEN` at [sanity.io/manage](https://sanity.io/manage) → Design Portfolio → API → Tokens → Add API token → choose **Editor** role

Never commit `.env.local`. It's gitignored for a reason.

### 5. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Sanity Studio is at [http://localhost:3000/studio](http://localhost:3000/studio).

---

## How to make and ship changes

**Never push directly to `main`.** All changes go through a pull request.

### The workflow

```bash
# 1. Always start from an up-to-date main
git checkout main
git pull origin main

# 2. Create a branch for your work
git checkout -b your-name/what-youre-doing
# e.g. git checkout -b maya/project-card-hover

# 3. Make your changes locally and verify them at localhost:3000

# 4. Commit and push your branch
git add .
git commit -m "short description of what you changed"
git push origin your-name/what-youre-doing

# 5. Open a Pull Request on GitHub
# Vercel will automatically build a preview URL for your branch
# Share the preview link for review before merging
```

Once the PR is approved and merged to `main`, Vercel automatically deploys to the live site.

---

## Design system rules

Read `CLAUDE.md` for the full picture. The short version:

- **Colors**: Use token names (`cream`, `ink`, `coral`, `white`) — never raw hex values
- **Font**: Avenir Next only, weights 400 and 500 only. No italics.
- **Spacing**: Be generous. Sections need breathing room.
- **Images**: Always use `next/image`. Never hardcode dimensions — use `fill` with a sized container.
- **Content**: Nothing is hardcoded in components. All content comes from Sanity.

---

## File structure
```
/app              → Pages (Next.js App Router)
/components
  /ui/            → Design system primitives (Button, Tag, etc.)
  /blocks/        → Sanity content block renderers
  /layout/        → Nav, Footer, PageWrapper
/lib/sanity/      → Sanity client, queries, types
/sanity/schemas/  → Sanity content schemas
/styles/          → globals.css with CSS variables
```

---

## Questions?

Ping Feliks or open a GitHub Discussion on the repo.
