import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from '@/lib/theme'

const avenir = localFont({
  src: [
    {
      path: '../public/fonts/AvenirNext-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/AvenirNext-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-avenir',
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
    <html lang="en" className={avenir.variable} suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
