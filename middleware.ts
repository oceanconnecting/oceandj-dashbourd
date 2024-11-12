import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token && pathname !== '/') {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  if (token && pathname === '/') {
    const url = new URL('/dashboard', req.url);
    return NextResponse.redirect(url);
  }

  // If the user is logged in, allow access to all routes
  return NextResponse.next();
}

// Specify the routes where the middleware should run
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Apply to all routes except for the root path
};

