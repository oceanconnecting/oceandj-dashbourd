import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Get the pathname of the request (e.g. /dashboard)
  const { pathname } = req.nextUrl;

  // If the user is not logged in and they are trying to access a protected route
  if (!token && pathname !== '/') {
    // Redirect them to the homepage ("/")
    const url = new URL('/', req.url); // Create a new URL based on the request URL
    return NextResponse.redirect(url);
  }

  // If the user is logged in, allow access to all routes
  return NextResponse.next();
}

// Specify the routes where the middleware should run
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Apply to all routes except for the root path
};

