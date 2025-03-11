import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow access to the sign-in page even if not authenticated
  if (pathname === '/auth/signin') {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to the sign-in page
  if (!token) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url); // Preserve the original URL to redirect back after login
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], // Apply to all routes except static files
};
