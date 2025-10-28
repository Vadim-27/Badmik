

// //===========================

// // middleware.ts
// import createIntlMiddleware from 'next-intl/middleware';
// import { NextRequest, NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';
// import { routing } from './i18n/routing';


// //=======

// // const intl = createMiddleware(routing);

// // export function middleware(request: NextRequest) {
// //   const { pathname } = request.nextUrl;

// //   
// //   if (
// //     pathname.startsWith("/api") ||
// //     pathname.startsWith("/_next") ||
// //     pathname === "/favicon.ico" ||
// //     /\.[a-zA-Z0-9]+$/.test(pathname)
// //   ) {
// //     return NextResponse.next();
// //   }

// //
// //   const intlResponse = intl(request);
// //   if (intlResponse && intlResponse.status !== 200) return intlResponse;


// //   return NextResponse.next();
// // }



// const intl = createIntlMiddleware(routing);
// //========


// const locales = routing.locales;

// function isLocale(value: string): value is typeof locales[number] {
//   return locales.includes(value as typeof locales[number]);
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
//   // const { pathname } = request.nextUrl;

//   const pathname = stripLocale(request.nextUrl.pathname);

//   //=========

//   //  const { pathname } = request.nextUrl;


//    if (
//     pathname.startsWith("/api") ||
//      pathname.startsWith("/_next") ||
//     pathname === "/favicon.ico" ||
//      /\.[a-zA-Z0-9]+$/.test(pathname)
//    ) {
//      return NextResponse.next();
//    }


// //   const intlResponse = intl(request);
// //   if (intlResponse && intlResponse.status !== 200) {
// //     return intlResponse;
// //   }


//   //=========


//   const intlResponse = intlMiddleware(request);
//   if (intlResponse && intlResponse.status !== 200) {
//     return intlResponse; 
//   }

//   // if (pathname === '/') {
//   //   if (!payload) return NextResponse.redirect(new URL('/login', request.url));

//   //   const { role, clubId } = payload;
//   //   if (role === 'owner_admin' || role === 'assistant') {
//   //     return NextResponse.redirect(new URL('/admin', request.url));
//   //   }
//   //   if (role === 'club_admin') {
//   //     return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
//   //   }
//   // }
//   if (pathname === '/') {
//   return NextResponse.redirect(new URL('/admin', request.url));
// }


//   if (pathname.startsWith('/admin')) {
//     const token = request.cookies.get('token')?.value;
//     console.log("token", token)
//     if (!token) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     try {
//       const { payload } = await jwtVerify(token, JWT_SECRET);
//       const role = payload.role as string;
//       const clubId = payload.clubId as string | undefined;

//       if (role === 'owner_admin') {
//         if (pathname === '/') {
//           return NextResponse.redirect(new URL('/admin/', request.url));
//         }
//         return NextResponse.next();
//       };

//       if (role === 'assistant') {
//         if (pathname.startsWith('/admin/settings')) {
//           return NextResponse.redirect(new URL('/admin', request.url));
//         }
//         return NextResponse.next();
//       }

//       if (role === 'club_admin') {
//         console.log('pathname', pathname);
//          if (pathname === '/') {
//           return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
//         }
//         if (pathname === '/admin') {
//           return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
//         }
//         if (pathname.startsWith(`/admin/${clubId}`)) {
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
//   matcher: [
//     '/((?!api|_next|.*\\..*|favicon.ico).*)', 
//     '/admin',
//     '/admin/:path*'
//   ]
// };



//==================================


// middleware.ts
// import createIntlMiddleware from "next-intl/middleware";
// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";
// import { routing } from "./i18n/routing";

// const intl = createIntlMiddleware(routing);
// const JWT_SECRET = new TextEncoder().encode("your-secret");

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;


//   if (
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/_next") ||
//     pathname === "/favicon.ico" ||
//     /\.[a-zA-Z0-9]+$/.test(pathname)
//   ) {
//     return NextResponse.next();
//   }

//   const intlResponse = intl(request);
//   if (intlResponse && intlResponse.status !== 200) {
//     return intlResponse;
//   }


//   const pathNoLocale = request.nextUrl.pathname; 
//   if (pathNoLocale === "/") {
//     return NextResponse.redirect(new URL("/admin", request.url));
//   }

//   if (pathNoLocale.startsWith("/admin")) {
//     const token = request.cookies.get("token")?.value;
//     console.log("token", token)
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//     try {
//       const { payload } = await jwtVerify(token, JWT_SECRET);
//       const role = payload.role as string | undefined;
//       console.log("role", role)
//       const clubId = payload.clubId as string | undefined;

//       if (role === "owner_admin") return NextResponse.next();
//       if (role === "assistant") {
//         if (pathNoLocale.startsWith("/admin/settings")) {
//           return NextResponse.redirect(new URL("/admin", request.url));
//         }
//         return NextResponse.next();
//       }
//       if (role === "club_admin") {
//         if (pathNoLocale === "/admin") {
//           return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
//         }
//         if (clubId && pathNoLocale.startsWith(`/admin/${clubId}`)) {
//           return NextResponse.next();
//         }
//         return NextResponse.redirect(new URL(`/admin/${clubId}`, request.url));
//       }
//       return NextResponse.redirect(new URL("/login", request.url));
//     } catch {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {

//   // matcher: ["/((?!api|_next|.*\\..*|favicon.ico).*)"],
//    matcher: [
//      '/((?!api|_next|.*\\..*|favicon.ico).*)', // Локалізація для всіх
//      '/admin',
//     '/admin/:path*'
//   ],
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


  if (pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }


  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;
    console.log("token", token)
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
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

    
      const clubId = payload.clubId as string | undefined;
      console.log("MW role:", role);

      if (role === "SuperAdmin") {
        if (pathname === "/") {
          return NextResponse.redirect(new URL("/admin/", request.url));
        }
        return NextResponse.next();
      }

      if (role === "assistant") {
        if (pathname.startsWith("/admin/settings")) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.next();
      }

      if (role === "ClubAdmin") {
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





