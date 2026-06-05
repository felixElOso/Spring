import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coming Soon — Springcreative.studio',
  description: 'Springcreative.studio is coming soon.',
  robots: { index: false, follow: false },
}

export default function ComingSoonPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center section-pad text-center"
      style={{ backgroundColor: '#181C1F', color: '#F4F4EF' }}
    >
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight">
        Springcreative.studio
      </h1>
      <p className="mt-6 text-lg md:text-xl text-pepper-50">
        Coming soon.
      </p>
    </main>
  )
}
