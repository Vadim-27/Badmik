// import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

// export function middleware(request: NextRequest) {
//      console.log('MIDDLEWARE WORKS');
//   const { pathname } = request.nextUrl;

//   const token = request.cookies.get('token')?.value;
//   if (!token) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as any;

//     // Заборонити доступ до /admin/settings, якщо нема прав
//     if (
//       pathname.startsWith('/admin/settings') &&
//       !decoded.permissions?.includes('manage_settings')
//     ) {
//       return NextResponse.redirect(new URL('/admin', request.url));
//     }

//     if (decoded.role !== 'admin') {
//       return NextResponse.redirect(new URL('/', request.url));
//     }

//     return NextResponse.next();
//   } catch {
//     return NextResponse.redirect(new URL('/', request.url));
//   }
// }

// export const config = {
//   matcher: ['/admin', '/admin/:path*'],
// };

// middleware.ts

// import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';


// // const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

// const JWT_SECRET = 'your-secret';

// export default function middleware(request: NextRequest) {
// //   console.log('MIDDLEWARE WORKS ✅');

//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get('token')?.value;

//   if (!token) {
//     console.log('MID WORKS ✅');
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as any;
//     console.log('MIDDLEWARE  WORKS ✅');
//     console.log(decoded);

//     if (
//       pathname.startsWith('/admin/settings') &&
//       !decoded.permissions?.includes('manage_settings')
//     ) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     if (decoded.role !== 'admin') {
//       return NextResponse.redirect(new URL('/', request.url));
//     }

//     return NextResponse.next();
//   } catch (error) {
//     console.log('MIDDLEWARE not WORKS ✅');
//     console.log('Token:', token);
//   console.error('JWT VERIFY ERROR ❌:', error);
//     return NextResponse.redirect(new URL('/login', request.url));
    
//   }
// }

// export const config = {
//   matcher: ['/admin', '/admin/:path*'],
// };


//====================================??


// import { NextRequest, NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';

// const JWT_SECRET = new TextEncoder().encode('your-secret'); // секрет у Uint8Array

// export async function middleware(request: NextRequest) {
//   console.log('MIDDLEWARE WORKS ✅');

//   const token = request.cookies.get('token')?.value;
//   if (!token) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   try {
//     // Перевірка токена
//     const { payload } = await jwtVerify(token, JWT_SECRET);

//     // Приклад перевірки ролі або доступу
//     // if (payload.role !== 'admin' && payload.role !== 'admin2') {
//     //   return NextResponse.redirect(new URL('/', request.url));
//     // }
//     const allowedRoles = ['admin', 'admin2'];

// if (!allowedRoles.includes(payload.role as string)) {
//   return NextResponse.redirect(new URL('/', request.url));
// }

//     return NextResponse.next();
//   } catch (err) {
    
//     return NextResponse.redirect(new URL('/', request.url));
//   }
// }

// export const config = {
//   matcher: ['/admin', '/admin/:path*'],
// };

//============================//


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
    const permissions = payload.permissions as string[] | undefined;
    const pathname = request.nextUrl.pathname;

    // 👑 Якщо роль admin — доступ до всього
    if (role === 'admin') {
      return NextResponse.next();
    }

    // 🔐 Перевірка доступів для інших ролей
    const permissionMap: [string, string][] = [
  ['/admin/settings', 'manage_settings'],
  ['/admin/users', 'view_users'],
  ['/admin', 'admin_dashboard'],
];

const requiredPermission = permissionMap.find(([path]) => pathname.startsWith(path))?.[1];

if (requiredPermission && !permissions?.includes(requiredPermission)) {
  return NextResponse.redirect(new URL('/admin', request.url));
}

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};





