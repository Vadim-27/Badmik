

// // //===========================

// // middleware.ts
// import createIntlMiddleware from 'next-intl/middleware';
// import { NextRequest, NextResponse } from 'next/server';
// import { decodeJwt, JWTPayload } from 'jose';
// import { routing } from './i18n/routing';

// // ---- налаштування ----
// const AUTH_COOKIE = process.env.NEXT_PUBLIC_AUTH_COOKIE || 'token';

// const PUBLIC_ROUTES = new Set([
//   '/',            // якщо потрібен публічний root
//   '/login',
//   '/register',
//   '/forgot-password',
// ]);

// const locales = routing.locales;
// function isLocale(v: string): v is (typeof locales)[number] {
//   return locales.includes(v as any);
// }
// function stripLocale(pathname: string) {
//   const parts = pathname.split('/');
//   return isLocale(parts[1]) ? '/' + parts.slice(2).join('/') : pathname;
// }
// function getLocale(pathname: string): (typeof locales)[number] | null {
//   const seg = pathname.split('/')[1];
//   return isLocale(seg) ? seg : null;
// }

// // Клей next-intl з нашим auth
// const intl = createIntlMiddleware(routing);

// // [опц] Коди/імена ролей на клієнті (якщо бек шле enum-числа)
// enum RoleEnum {
//   SuperAdmin = 1,
//   ClubAdmin = 2,
//   Assistant = 3,
//   // ...
// }

// type MyClaims = JWTPayload & {
//   isAdmin?: boolean;
//   role?: string | number;
//   ClubId?: string;
//   // стандартні: sub, exp, ...
// };

// export function middleware(req: NextRequest) {
//   const { nextUrl } = req;
//   const rawPath = nextUrl.pathname;

//   // пропускаємо технічні та статику
//   if (
//     rawPath.startsWith('/_next') ||
//     rawPath.startsWith('/api') ||
//     rawPath === '/favicon.ico' ||
//     /\.[a-zA-Z0-9]+$/.test(rawPath)
//   ) {
//     return NextResponse.next();
//   }

//   // спочатку хай відпрацює next-intl
//   const intlRes = intl(req);
//   if (intlRes && intlRes.status !== 200) return intlRes;

//   const locale = getLocale(rawPath) || routing.defaultLocale;
//   const pathNoLoc = stripLocale(rawPath);

//   // публічні сторінки — пропускаємо без токена
//   if (PUBLIC_ROUTES.has(pathNoLoc)) {
//     return NextResponse.next();
//   }

//   // дістаємо токен з куки або з Authorization (fallback)
//   const token =
//     req.cookies.get(AUTH_COOKIE)?.value ||
//     (req.headers.get('authorization')?.startsWith('Bearer ')
//       ? req.headers.get('authorization')!.slice(7)
//       : undefined);

//   if (!token) {
//     // важливо: редіректимо на локалізований /login, інакше отримаєш петлю
//     const url = new URL(`/${locale}/login`, req.url);
//     url.searchParams.set('from', pathNoLoc);
//     return NextResponse.redirect(url);
//   }

//   // розбираємо клейми БЕЗ верифікації (на dev ок; у prod краще перевіряти підпис)
//     let claims: MyClaims | null = null;
//   try {
//     claims = decodeJwt(token) as MyClaims;

//     // 🟡 ось тут вставляємо логування:
//     console.log('======================================');
//     console.log('🔐 JWT PAYLOAD:');
//     console.log(JSON.stringify(claims, null, 2));
//     console.log('--------------------------------------');
//     console.log('isAdmin:', claims?.isAdmin);
//     console.log('role:', claims?.role);
//     console.log('ClubId:', claims?.ClubId);
//     console.log('sub:', claims?.sub);
//     console.log('exp:', claims?.exp);
//     console.log('======================================');

//   } catch (err) {
//     console.error('❌ Error decoding JWT:', err);
//     const url = new URL(`/${locale}/login`, req.url);
//     return NextResponse.redirect(url);
//   }
//   // let claims: MyClaims | null = null;
//   // try {
//   //   claims = decodeJwt(token) as MyClaims;
//   // } catch {
//   //   const url = new URL(`/${locale}/login`, req.url);
//   //   return NextResponse.redirect(url);
//   // }

//   const isAdmin = !!claims?.isAdmin;               // НОВЕ: глобальний адмін
//   const role = claims?.role;                       // може бути number (enum) або string
//   const clubId = claims?.ClubId || null;

//   // ***** ГЛОБАЛЬНИЙ АДМІН: пускаємо всюди *****
//   if (isAdmin) return NextResponse.next();

//   // ***** Розбір ролей, якщо бек шле enum-числа *****
//   const roleIs = {
//     superAdmin: role === 'SuperAdmin' || role === RoleEnum.SuperAdmin,
//     clubAdmin:  role === 'ClubAdmin'  || role === RoleEnum.ClubAdmin,
//     assistant:  role === 'assistant'  || role === RoleEnum.Assistant,
//   };

//   // ***** Логіка доступу *****
//   // приклад: assistant не може в /admin/settings
//   if (roleIs.assistant && pathNoLoc.startsWith('/admin/settings')) {
//     const url = new URL(`/${locale}/admin`, req.url);
//     return NextResponse.redirect(url);
//   }

//   // приклад: club admin прив’язаний до clubId
//   if (roleIs.clubAdmin) {
//     if (!clubId) {
//       // немає клубу в клеймах — або вибір клубу, або login
//       const url = new URL(`/${locale}/login`, req.url);
//       return NextResponse.redirect(url);
//     }
//     // дозволяємо тільки в свій сегмент /admin/:clubId
//     if (
//       pathNoLoc === '/admin' ||
//       !pathNoLoc.startsWith(`/admin/${clubId}`)
//     ) {
//       const url = new URL(`/${locale}/admin/${clubId}`, req.url);
//       return NextResponse.redirect(url);
//     }
//     return NextResponse.next();
//   }

//   // якщо роль/клейми не підпадають — шлемо на логін
//   const toLogin = new URL(`/${locale}/login`, req.url);
//   return NextResponse.redirect(toLogin);
// }

// export const config = {
//   // застосовуємо тільки до сторінок (виключаючи _next, api, статику)
//   matcher: ['/((?!_next|api|.*\\..*|favicon.ico).*)'],
// };


//====================


import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";
import { routing } from "./i18n/routing";
import { decodeJwt /*, jwtVerify*/ } from "jose";

const ROLE_CLAIM   = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const NAMEID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

const locales = routing.locales;
function isLocale(value: string): value is (typeof locales)[number] {
  return locales.includes(value as (typeof locales)[number]);
}

function stripLocale(pathname: string) {
  const parts = pathname.split("/");
  if (isLocale(parts[1])) {
    return "/" + parts.slice(2).join("/");
  }
  return pathname;
}

const JWT_SECRET = new TextEncoder().encode("your-secret");
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname: rawPathname } = request.nextUrl;

  
  if (
    rawPathname.startsWith("/api") ||
    rawPathname.startsWith("/_next") ||
    rawPathname === "/favicon.ico" ||
    /\.[a-zA-Z0-9]+$/.test(rawPathname)
  ) {
    return NextResponse.next();
  }

  
  const pathname = stripLocale(rawPathname);

 
  const intlResponse = intlMiddleware(request);
  if (intlResponse && intlResponse.status !== 200) {
    return intlResponse; 
  }

  const url = request.nextUrl.clone();
const parts = url.pathname.split("/");
const maybeLocale = parts[1];
const loginPath = isLocale(maybeLocale) ? `/${maybeLocale}/login` : "/login";
if (pathname === "/login") {
  // вже на сторінці логіну — віддай її без перевірки токена
  return NextResponse.next();
}

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/admin/dashboard/", request.url));
  }


  if (pathname.startsWith("/")) {
    const token = request.cookies.get("token")?.value;
    console.log("token", token)
    // if (!token) {
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }

    if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath; // як вище
    return NextResponse.redirect(url);
  }

    try {
      // const { payload } = await jwtVerify(token, JWT_SECRET);
      // const payload: any = decodeJwt(token);
      // const role = payload.role as string;
      // console.log("role", role)

      const payload: any = decodeJwt(token);

    const role =
      (payload[ROLE_CLAIM] as string | undefined) ??
      (payload.role as string | undefined);

    const userId =
      (payload[NAMEID_CLAIM] as string | undefined) ??
      (payload.sub as string | undefined);

      console.log('JWT payload:', JSON.stringify(payload, null, 2));

    
      const clubId = payload.clubId as string | undefined;
      // const isAdmin = payload.isAdmin as string | undefined;
      console.log("MW role:", role);
      console.log("clubId", clubId);
      const isAdmin =
  payload.isAdmin === true ||
  payload.isAdmin === "True" ||
  payload.isAdmin === "true";

      // if (role === "SuperAdmin") {
      //   if (pathname === "/") {
      //     return NextResponse.redirect(new URL("/admin/dashboard/", request.url));
      //   }
      //   return NextResponse.next();
      // }

       if (isAdmin) {
        if (pathname === "/") {
          console.log("clubId", clubId);
          return NextResponse.redirect(new URL("/admin/dashboard/", request.url));
        }
        console.log("clubId", clubId);
        return NextResponse.next();
      }

      if (role === "assistant") {
        if (pathname.startsWith("/admin/settings")) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.next();
      }

      if (!isAdmin && clubId) {
        // console.log("pathname", pathname);
        if (pathname === "/") {
          return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
        }
        if (pathname === "/admin") {
          return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
        }
        if (clubId && pathname.startsWith(`/admin/${clubId}`)) {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
      }

      return NextResponse.redirect(new URL("/login", request.url));
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }


  return NextResponse.next();
}


export const config = {
  matcher: ["/((?!api|_next|.*\\..*|favicon.ico).*)", "/admin", "/admin/:path*"],
};





