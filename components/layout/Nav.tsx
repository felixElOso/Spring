'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/90 backdrop-blur-md border-b border-border' : ''
        }`}
      >
        <div className="max-w-content mx-auto section-pad flex items-center justify-between h-16">
          <Link href="/" className="font-medium text-sm tracking-widest uppercase transition-colors duration-300 text-foreground">
            Spring
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className="text-sm transition-colors duration-300 text-foreground/70 hover:text-coral">
              Work
            </Link>
            <Link href="/about" className="text-sm transition-colors duration-300 text-foreground/70 hover:text-coral">
              About
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px transition-all duration-200 bg-foreground ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-px transition-all duration-200 bg-foreground ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px transition-all duration-200 bg-foreground ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-64 bg-background border-l border-border flex flex-col pt-20 px-8 gap-8 md:hidden"
          >
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-2xl font-medium text-foreground hover:text-coral transition-colors">
              Work
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="text-2xl font-medium text-foreground hover:text-coral transition-colors">
              About
            </Link>
            <ThemeToggle className="mt-auto mb-8" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
