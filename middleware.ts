import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public custom domains that should be gated behind the holding page.
// Everything else — the spring-gamma.vercel.app preview URL and the
// spring-*.vercel.app deploy URLs — sees the full site.
const GATED_HOSTS = new Set([
  'www.springcreative.studio',
  'springcreative.studio',
])

// Holding-page gate: the public site is not ready to go live, so on the
// gated public domain every route is rewritten to /coming-soon. The Sanity
// Studio (/studio) stays accessible so content can still be edited.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host')?.split(':')[0] ?? ''

  // Only the public custom domain is gated. Vercel URLs show the full site.
  if (!GATED_HOSTS.has(host)) {
    return NextResponse.next()
  }

  const allowed =
    pathname === '/coming-soon' ||
    pathname.startsWith('/studio')

  if (allowed) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/coming-soon'
  return NextResponse.rewrite(url)
}

export const config = {
  // Run on everything except Next internals, the API, and static assets
  // (files with an extension, e.g. .ico, .png, .woff2).
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico|.*\\..*).*)'],
}
