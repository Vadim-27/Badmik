

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('your-secret');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const role = payload.role as string;
    const clubId = payload.clubId as string | undefined;
    const pathname = request.nextUrl.pathname;


    if (role === 'owner_admin') {
      return NextResponse.next();
    }

  
    if (role === 'assistant') {
      if (pathname.startsWith('/admin/settings')) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

  
    if (role === 'club_admin') {
      if (pathname === '/admin') {
        return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
      }

      if (pathname.startsWith(`/admin/${clubId}`)) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL('/admin', request.url));
    }


    return NextResponse.redirect(new URL('/', request.url));
  } catch (err) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [],
};






