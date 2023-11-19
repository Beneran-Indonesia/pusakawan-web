import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Getting current user's token credentials
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const loggedIn = token !== null;
  // Redirect user to / if user is not logged in
  if (pathname === '/user' && !loggedIn) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  // Redirect user to /user if user is logged in
  if ((pathname === '/login' || pathname === '/register' || pathname === 'reset-password') && loggedIn) {
    return NextResponse.redirect(new URL('/user', req.url))
  }
  return NextResponse.next();
}
