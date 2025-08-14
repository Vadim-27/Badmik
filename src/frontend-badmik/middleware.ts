

// import { NextRequest, NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';

// const JWT_SECRET = new TextEncoder().encode('your-secret');

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get('token')?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   try {
//     const { payload } = await jwtVerify(token, JWT_SECRET);

//     const role = payload.role as string;
//     const clubId = payload.clubId as string | undefined;
//     const pathname = request.nextUrl.pathname;


//     if (role === 'owner_admin') {
//       return NextResponse.next();
//     }

  
//     if (role === 'assistant') {
//       if (pathname.startsWith('/admin/settings')) {
//         return NextResponse.redirect(new URL('/admin', request.url));
//       }
//       return NextResponse.next();
//     }

  
//     if (role === 'club_admin') {
//       if (pathname === '/admin') {
//         return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
//       }

//       if (pathname.startsWith(`/admin/${clubId}`)) {
//         return NextResponse.next();
//       }

//       return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
//     }


//     return NextResponse.redirect(new URL('/', request.url));
//   } catch (err) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }
// }

// export const config = {
//   matcher: ['/admin', '/admin/:path*'],
// };

//===========================

// middleware.ts
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { routing } from './i18n/routing';


const locales = routing.locales;

function isLocale(value: string): value is typeof locales[number] {
  return locales.includes(value as typeof locales[number]);
}

function stripLocale(pathname: string) {
  const parts = pathname.split('/');
  if (isLocale(parts[1])) {
    return '/' + parts.slice(2).join('/');
  }
  return pathname;
}

const JWT_SECRET = new TextEncoder().encode('your-secret');

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  const pathname = stripLocale(request.nextUrl.pathname);

  // Локалізація
  const intlResponse = intlMiddleware(request);
  if (intlResponse && intlResponse.status !== 200) {
    return intlResponse; // редірект локалізації
  }

  // Авторизація тільки для /admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string;
      const clubId = payload.clubId as string | undefined;

      if (role === 'owner_admin') return NextResponse.next();

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
        return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
      }

      return NextResponse.redirect(new URL('/', request.url));
    } catch {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Для інших маршрутів тільки локалізація
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)', // Локалізація для всіх
    '/admin',
    '/admin/:path*'
  ]
};








