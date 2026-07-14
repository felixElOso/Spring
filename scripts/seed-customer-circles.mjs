// Seeds the "Customer asset library" project with the Customer Circles block,
// reproducing the demo exactly: the same 22 photos (public/customer-circles/
// customer-01..22.jpg) in the same order, with the demo names/roles/sizes.
//
// Idempotent: uploads each image once (deterministic asset via sha1 dedupe),
// and REPLACES any existing customerCirclesBlock on the project rather than
// appending a duplicate. Safe to re-run.
//
// Run from the worktree root:  node scripts/seed-customer-circles.mjs
// Requires SANITY_API_TOKEN (Editor) in the MAIN repo's .env.local.

import { createClient } from '@sanity/client'
import fs from 'node:fs'
import path from 'node:path'

const MAIN_ENV = '/Users/fstekolshch/Desktop/Claude Playground/Spring/.env.local'
const IMG_DIR = decodeURIComponent(new URL('../public/customer-circles/', import.meta.url).pathname)
const PROJECT_ID = 'c158a2ef-3dbc-415d-97df-0ad0a1e2d260' // "Customer asset library"

// Exact demo content, in slot order (customer i → SLOTS[i], photo customer-{i+1}).
const NAMES = [
  ['Maya Chen', 'Small business owner · Austin, TX'],
  ['Darnell Brooks', 'Freelance photographer · Atlanta'],
  ['Priya Patel', 'Nurse practitioner · Seattle'],
  ['Tomás Rivera', 'Rideshare driver · Phoenix'],
  ['Hannah Schmidt', 'Teacher · Madison, WI'],
  ['Jerome Wallace', 'Retired veteran · Tampa'],
  ['Aisha Okafor', 'Grad student · Boston'],
  ['Greg Lindqvist', 'Carpenter · Portland'],
  ['Sofia Marino', 'Café owner · Brooklyn'],
  ['Kenji Tanaka', 'Software engineer · San Jose'],
  ['Rosa Delgado', 'Home health aide · El Paso'],
  ['Liam O’Connor', 'Musician · Nashville'],
  ['Fatima Al-Sayed', 'Pharmacist · Dearborn'],
  ['Marcus Webb', 'Landscaper · Sacramento'],
  ['Elena Petrova', 'Translator · Chicago'],
  ['DeShawn Carter', 'Personal trainer · Houston'],
  ['Nora Lindgren', 'Architect · Minneapolis'],
  ['Carlos Mendez', 'Mechanic · Denver'],
  ['Amara Johnson', 'Social worker · Baltimore'],
  ['Yuki Sato', 'Illustrator · Los Angeles'],
  ['Benjamin Cole', 'Consultant · Charlotte'],
  ['Grace Mwangi', 'Researcher · Ann Arbor'],
]
const SIZES = ['lg', 'md', 'sm'] // cycled, matching the demo

function loadEnv(file) {
  const out = {}
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const i = line.indexOf('=')
    if (i === -1) continue
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return out
}

const env = loadEnv(MAIN_ENV)
const token = env.SANITY_API_TOKEN
if (!token) {
  console.error('✗ SANITY_API_TOKEN is empty in', MAIN_ENV)
  console.error('  Create an Editor token at manage.sanity.io and set it there, then re-run.')
  process.exit(1)
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bequcx1g',
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function main() {
  console.log('Uploading 22 images…')
  const customers = []
  for (let i = 0; i < NAMES.length; i++) {
    const n = String(i + 1).padStart(2, '0')
    const file = path.join(IMG_DIR, `customer-${n}.jpg`)
    const asset = await client.assets.upload('image', fs.createReadStream(file), {
      filename: `customer-circle-${n}.jpg`,
    })
    const [name, role] = NAMES[i]
    customers.push({
      _key: `cc${n}`,
      _type: 'customer',
      name,
      role,
      size: SIZES[i % 3],
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    })
    process.stdout.write(`  ${n} ✓  `)
    if ((i + 1) % 5 === 0) process.stdout.write('\n')
  }
  console.log('\nAll images uploaded.')

  const block = {
    _key: 'customerCircles',
    _type: 'customerCirclesBlock',
    layout: 'full-bleed',
    customers,
  }

  // Fetch current contentBlocks, drop any existing customerCirclesBlock, append ours.
  const project = await client.getDocument(PROJECT_ID)
  if (!project) throw new Error('Project not found: ' + PROJECT_ID)
  const existing = (project.contentBlocks || []).filter(
    (b) => b._type !== 'customerCirclesBlock',
  )
  const contentBlocks = [...existing, block]

  await client.patch(PROJECT_ID).set({ contentBlocks }).commit()
  console.log(`✓ Patched "${typeof project.title === 'string' ? project.title : 'project'}" — ${customers.length} circles, block appended at end.`)
}

main().catch((e) => {
  console.error('✗ Seed failed:', e.message)
  process.exit(1)
})
