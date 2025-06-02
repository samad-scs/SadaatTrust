import { NextResponse } from 'next/server'

import { auth } from '@/auth'

export default auth(req => {
  const { pathname, origin } = req.nextUrl
  const session = req.auth

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/forgot-password']

  // Authenticated user trying to access public routes
  if (session && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', origin))
  }

  // Unauthenticated user trying to access non-public routes
  if (!session && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, origin))
  }

  // Allow the request to proceed for other cases
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
