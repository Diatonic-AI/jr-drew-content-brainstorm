import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const protectedRoutes = ['/dashboard', '/projects', '/settings']
export const publicRoutes = ['/', '/home', '/login', '/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('diatonicAuthToken')?.value
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = ['/login', '/signup'].some(route => pathname.startsWith(route))

  if (isProtected && !token) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    loginUrl.searchParams.set('auth', 'login')
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\\..*).*)']
}
