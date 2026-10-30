import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, decodeSession } from '@/lib/auth';

/**
 * Next.js 16 Proxy Convention
 * Injects statutory security headers without interfering with client-side RSC hydration.
 * Route-level authorization is enforced within page components and server actions.
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

  // Expired or malformed cookies otherwise remain in the browser and can
  // repeatedly influence auth redirects. Clear them on the response.
  const clearInvalidSession = (response: NextResponse) => {
    if (sessionCookie && !session) {
      response.cookies.delete(SESSION_COOKIE_NAME);
    }
    return response;
  };

  // 1. Guard /admin routes — Requires verified 'admin' role
  if (isAdminRoute) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname + search);
      loginUrl.searchParams.set('error', 'login_required');
      return clearInvalidSession(NextResponse.redirect(loginUrl));
    }

    if (user.role !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname + search);
      loginUrl.searchParams.set('error', 'admin_required');
      return clearInvalidSession(NextResponse.redirect(loginUrl));
    }
  }

  // 2. Guard /bookings routes — Requires an authenticated user
  if (isBookingsRoute) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname + search);
      loginUrl.searchParams.set('error', 'login_required');
      return clearInvalidSession(NextResponse.redirect(loginUrl));
    }
  }

  // 3. If authenticated user tries to access /login or /user/login, redirect to intended target or /discover
  if ((pathname === '/login' || pathname === '/user/login') && user) {
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    const safeRedirect = !!redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//') &&
      !redirectParam.startsWith('/login') && !redirectParam.startsWith('/user/login');
    const destination = safeRedirect && redirectParam ? redirectParam : (user.role === 'admin' ? '/admin' : '/discover');
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 4. Create base response and inject enhanced security headers
  const response = clearInvalidSession(NextResponse.next());

  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
