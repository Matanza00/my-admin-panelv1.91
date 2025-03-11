import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Allow access to the sign-in page and API routes
  const pathname = req.nextUrl.pathname;

  // List of allowed paths for unauthenticated users
  if (
    pathname === '/auth/signin' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.html')
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to the sign-in page
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
   }//console.log("123123")

// console.log(token)
  // Check if the user is a tenant and restrict access
  if (token.role === 'tenant') {
    if (!pathname.startsWith('/customer-relation/feedback-complain') && !pathname.startsWith('/janitorial/report')) {
      return NextResponse.redirect(new URL('/customer-relation/feedback-complain', req.url)); // Redirect if trying to access non-permitted pages
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], // Apply middleware to all routes
};
