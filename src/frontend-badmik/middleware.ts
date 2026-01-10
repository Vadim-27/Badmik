//====================

// import createIntlMiddleware from 'next-intl/middleware';
// import { NextRequest, NextResponse } from 'next/server';
// // import { jwtVerify } from "jose";
// import { routing } from './i18n/routing';
// import { decodeJwt /*, jwtVerify*/ } from 'jose';

// const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
// const NAMEID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

// const locales = routing.locales;
// function isLocale(value: string): value is (typeof locales)[number] {
//   return locales.includes(value as (typeof locales)[number]);
// }

// function stripLocale(pathname: string) {
//   const parts = pathname.split('/');
//   if (isLocale(parts[1])) {
//     return '/' + parts.slice(2).join('/');
//   }
//   return pathname;
// }

// const JWT_SECRET = new TextEncoder().encode('your-secret');
// const intlMiddleware = createIntlMiddleware(routing);

// export async function middleware(request: NextRequest) {
//   const { pathname: rawPathname } = request.nextUrl;

//   if (
//     rawPathname.startsWith('/api') ||
//     rawPathname.startsWith('/_next') ||
//     rawPathname === '/favicon.ico' ||
//     /\.[a-zA-Z0-9]+$/.test(rawPathname)
//   ) {
//     return NextResponse.next();
//   }

//   const pathname = stripLocale(rawPathname);

//   const intlResponse = intlMiddleware(request);
//   if (intlResponse && intlResponse.status !== 200) {
//     return intlResponse;
//   }

//   const url = request.nextUrl.clone();
//   const parts = url.pathname.split('/');
//   const maybeLocale = parts[1];
//   const loginPath = isLocale(maybeLocale) ? `/${maybeLocale}/login` : '/login';
//   if (pathname === '/login/') {
//     // вже на сторінці логіну — віддай її без перевірки токена
//     return NextResponse.next();
//   }

//   if (pathname === '/') {
//     return NextResponse.redirect(new URL('/admin/dashboard/', request.url));
//   }

//   if (pathname.startsWith('/')) {
//     const token = request.cookies.get('token')?.value;
//     console.log('token', token);
//     // if (!token) {
//     //   return NextResponse.redirect(new URL("/login", request.url));
//     // }

//     if (!token) {
//       const url = request.nextUrl.clone();
//       url.pathname = loginPath; // як вище
//       return NextResponse.redirect(url);
//     }

//     try {

//       const payload: any = decodeJwt(token);

//       const role =
//         (payload[ROLE_CLAIM] as string | undefined) ?? (payload.role as string | undefined);

//       const userId =
//         (payload[NAMEID_CLAIM] as string | undefined) ?? (payload.sub as string | undefined);

//       console.log('JWT payload:', JSON.stringify(payload, null, 2));

//       const clubId = payload.clubId as string | undefined;
//       // const isAdmin = payload.isAdmin as string | undefined;
//       console.log('MW role:', role);
//       console.log('clubId', clubId);
//       const isAdmin =
//         payload.isAdmin === true || payload.isAdmin === 'True' || payload.isAdmin === 'true';

//       if (isAdmin) {
//         if (pathname === '/') {
//           return NextResponse.redirect(new URL('/admin/dashboard/', request.url));
//         }

//         return NextResponse.next();
//       }

//       if (role === 'assistant') {
//         if (pathname.startsWith('/admin/settings')) {
//           return NextResponse.redirect(new URL('/admin', request.url));
//         }
//         return NextResponse.next();
//       }

//       if (!isAdmin && clubId) {
//         // console.log("pathname", pathname);
//         if (pathname === '/') {
//           return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
//         }
//         if (pathname === '/admin') {
//           return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
//         }
//         if (clubId && pathname.startsWith(`/admin/${clubId}`)) {
//           return NextResponse.next();
//         }
//         return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
//       }

//       return NextResponse.redirect(new URL('/login', request.url));
//     } catch {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next|.*\\..*|favicon.ico).*)', '/admin', '/admin/:path*'],
// };

//========================================================

// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { decodeJwt } from 'jose';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// Клейми з JWT
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const NAMEID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

const locales = routing.locales as readonly string[];

function isLocale(value: string): value is (typeof locales)[number] {
  return locales.includes(value as (typeof locales)[number]);
}

// Забираємо /en, /uk з початку шляху
function stripLocale(pathname: string) {
  const parts = pathname.split('/');
  if (parts.length > 1 && isLocale(parts[1])) {
    return '/' + parts.slice(2).join('/');
  }
  return pathname;
}

export async function middleware(request: NextRequest) {
  const { pathname: rawPathname } = request.nextUrl;

  // 0) Пропускаємо API та статику
  if (
    rawPathname.startsWith('/api') ||
    rawPathname.startsWith('/_next') ||
    rawPathname === '/favicon.ico' ||
    /\.[a-zA-Z0-9]+$/.test(rawPathname)
  ) {
    return NextResponse.next();
  }

  // 1) Нехай next-intl розрулить локалі / 404 / т.п.
  const intlResponse = intlMiddleware(request);
  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  // 2) path без локалі + нормалізація хвостового /
  let pathname = stripLocale(rawPathname); // напр. /login/ → /login/
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1); // /login/ → /login
  }

  // 3) Визначаємо локаль для побудови login URL
  const firstSegment = request.nextUrl.pathname.split('/')[1];
  const locale = isLocale(firstSegment) ? firstSegment : undefined;
  const loginPath = locale ? `/${locale}/login` : '/login';

  // 4) Сторінка логіну — завжди публічна, ніякого токена
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // 5) Всі інші шляхи — вимагають токен
  const token = request.cookies.get('token')?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.search = ''; // щоб не насмикати циклів з query
    return NextResponse.redirect(url);
  }

  try {
    const payload: any = decodeJwt(token);

    const role =
      (payload[ROLE_CLAIM] as string | undefined) ?? (payload.role as string | undefined);

    const userId =
      (payload[NAMEID_CLAIM] as string | undefined) ?? (payload.sub as string | undefined);

    const clubId = payload.clubId as string | undefined;

    const isAdmin =
      payload.isAdmin === true || payload.isAdmin === 'True' || payload.isAdmin === 'true';

    // === 6) SUPER ADMIN / GLOBAL ADMIN ==========================
    if (isAdmin) {
      // root → на дашборд
      if (pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = locale ? `/${locale}/admin/dashboard` : '/admin/dashboard';
        return NextResponse.redirect(url);
      }
      // все інше супер адмін бачить
      return NextResponse.next();
    }

    // === 7) ASSISTANT ============================================
    if (role === 'assistant') {
      // асистенту не можна в /admin/settings
      if (pathname.startsWith('/admin/settings')) {
        const url = request.nextUrl.clone();
        url.pathname = locale ? `/${locale}/admin` : '/admin';
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    // === 8) CLUB ADMIN (НЕ супер адмін, але є clubId) ============
    if (clubId && !isAdmin) {
      const clubBase = `/admin/${clubId}`;
      const clubDashboard = `${clubBase}/dashboard`;

      // "/" або "/admin" → редірект в /admin/:clubId/dashboard
      if (pathname === '/' || pathname === '/admin') {
        const url = request.nextUrl.clone();
        url.pathname = locale ? `/${locale}${clubDashboard}` : clubDashboard;
        return NextResponse.redirect(url);
      }

      // якщо вже всередині свого клубу → пускаємо
      if (pathname.startsWith(clubBase)) {
        return NextResponse.next();
      }

      // все інше → форсимо в /admin/:clubId/dashboard
      const url = request.nextUrl.clone();
      url.pathname = locale ? `/${locale}${clubDashboard}` : clubDashboard;
      return NextResponse.redirect(url);
    }

    // === 9) Токен є, але роль незрозуміла → на логін ============
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.search = '';
    return NextResponse.redirect(url);
  } catch {
    // токен битий / протух — на логін
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.search = '';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*|favicon.ico).*)', '/admin', '/admin/:path*'],
};
