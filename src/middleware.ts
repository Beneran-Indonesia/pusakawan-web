import axios from 'axios';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Getting current user's token credentials
  const loggedIn = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (loggedIn) {
    console.log(loggedIn)
    // const sessionToken = req.cookies.get('next-auth.session-token');
    // axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionToken?.value;
    // console.log(axios.defaults.headers.common);
  }
  return NextResponse.next();
}
