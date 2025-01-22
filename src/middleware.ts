import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // const path = request.nextUrl.pathname;
  // const authCookie = request.cookies.get('auth');
  // const isAuthenticated = !!authCookie?.value;

  // // Public routes that don't require authentication
  // const publicRoutes = ['/', '/login'];
  // const isPublicRoute = publicRoutes.includes(path) || path === '/not-found';

  // // Handle authentication redirects
  // if (isAuthenticated && path === '/login') {
  //   // Redirect authenticated users away from login
  //   return NextResponse.redirect(new URL('/quests', request.url));
  // }

  // if (!isAuthenticated && !isPublicRoute) {
  //   // Protect all non-public routes
  //   const returnUrl = encodeURIComponent(path);
  //   return NextResponse.redirect(new URL(`/login?returnUrl=${returnUrl}`, request.url));
  // }

  return NextResponse.next();
}
 
// Match all routes except Next.js internals and static files
export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
