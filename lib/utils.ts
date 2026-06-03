import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Collapse any editor-entered line breaks in a project title down to single
 * spaces. The project hero honors line breaks for visual wrapping; everywhere
 * else (nav, cards, teasers, SEO/OG) the title should read as one line.
 */
export function flattenTitle(title: string): string {
  return title.replace(/\s*\n\s*/g, " ").trim()
}
