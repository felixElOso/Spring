'use client'

import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import type { RichTextBlock as RichTextBlockType } from '@/lib/sanity/types'

interface Props {
  block: RichTextBlockType
}

const components = {
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-3xl md:text-4xl font-medium text-foreground mt-16 mb-6">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-medium text-foreground mt-12 mb-4">{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-lg text-foreground/80 leading-relaxed mb-6">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-16 md:my-20 pl-10 md:pl-16 text-[clamp(1.75rem,3.5vw,3.5rem)] font-medium text-coral leading-tight tracking-tight">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 text-coral hover:opacity-70 transition-opacity"
      >
        {children}
      </a>
    ),
  },
}

const layoutClass = {
  contained: 'max-w-3xl mx-auto px-6 md:px-12 lg:px-24',
  'full-width': 'max-w-content mx-auto section-pad',
}

export function RichTextBlock({ block }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`py-12 ${layoutClass[block.layout] || layoutClass.contained}`}
    >
      <PortableText value={block.content} components={components} />
    </motion.div>
  )
}
