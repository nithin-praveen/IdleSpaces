import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, decodeSession } from '@/lib/auth';

/**
 * Next.js 16 Proxy Convention
 * Replaces deprecated middleware.js as specified in Next.js 16 architecture.
 * Enforces role-based route protection, session validation, and security headers.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Paths requiring specific authentication/role protection
  const isAdminRoute = pathname.startsWith('/admin');
  const isBookingsRoute = pathname.startsWith('/bookings');

  // Retrieve secure session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionCookie ? decodeSession(sessionCookie) : null;
  const user = session?.user;

  // 1. Guard /admin routes — Requires verified 'admin' role
  if (isAdminRoute) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname + search);
      loginUrl.searchParams.set('error', 'login_required');
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname + search);
      loginUrl.searchParams.set('error', 'admin_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard /bookings routes — Requires an authenticated user
  if (isBookingsRoute) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname + search);
      loginUrl.searchParams.set('error', 'login_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. If authenticated user tries to access /login or /user/login, redirect to intended target or /discover
  if ((pathname === '/login' || pathname === '/user/login') && user) {
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    const destination = redirectParam && redirectParam.startsWith('/') ? redirectParam : (user.role === 'admin' ? '/admin' : '/discover');
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 4. Create base response and inject enhanced security headers
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes if any)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

