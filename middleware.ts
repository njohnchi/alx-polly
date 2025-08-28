import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get the auth cookie
  const supabaseSession = request.cookies.get('sb-auth-token');
  const hasSession = !!supabaseSession;

  // If the user is not signed in and the current path is not /auth/login or /auth/register,
  // redirect the user to /auth/login
  if (!hasSession && 
      !request.nextUrl.pathname.startsWith('/auth/login') && 
      !request.nextUrl.pathname.startsWith('/auth/register') &&
      request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If the user is signed in and the current path is /auth/login or /auth/register,
  // redirect the user to /polls
  if (hasSession && 
      (request.nextUrl.pathname.startsWith('/auth/login') || 
       request.nextUrl.pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/polls', request.url));
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run for
export const config = {
  matcher: [
    '/polls/:path*',
    '/profile/:path*',
    '/auth/login',
    '/auth/register',
  ],
};