import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/settings', '/matches', '/live-scoring','/yourmatches'];
const authPages = ['/login', '/signup','/'];

export function middleware(request: NextRequest) {
  console.log("middleware is running");

  const sessionCookie = request.cookies.get('session')?.value;

  
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthPage = authPages.includes(pathname);

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from login/signup pages
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Otherwise, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/matches/:path*',
    '/live-scoring/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
    '/'
  ],
};
