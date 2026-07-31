import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const tally = localFont({
  src: [
    {
      path: '../public/fonts/Tally-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Tally-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-tally',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})

export const metadata: Metadata = {
  title: {
    template: '%s — Studio',
    default: 'Studio — Design Portfolio',
  },
  description: 'A design team portfolio.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${tally.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
