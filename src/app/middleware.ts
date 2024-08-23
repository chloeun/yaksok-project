import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow access to public paths
  if (pathname === '/login' || pathname === '/api/auth') {
    return NextResponse.next();
  }

  // Redirect to login if no token is found
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*', '/another-protected-page'], // Add protected paths
};
