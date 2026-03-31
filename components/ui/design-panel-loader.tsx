'use client'

import dynamic from 'next/dynamic'

const Panel = dynamic(
  () => import('./design-panel').then(m => ({ default: m.DesignPanel })),
  { ssr: false }
)

export function DesignPanelLoader() {
  return <Panel />
}
