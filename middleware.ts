import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Holding-page gate: the public site is not ready to go live, so every
// public route is rewritten to /coming-soon. The Sanity Studio (/studio)
// stays accessible so content can still be edited.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
