// import jwt from 'jsonwebtoken';
// import { cookies } from 'next/headers';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

// export type JwtPayload = {
//   sub: string;
//   email: string;
//   role: string;
//   accessLevel?: 'full' | 'limited';
//   permissions?: string[];
// };

// export function getToken(): JwtPayload | null {
//   const cookieStore = cookies();
//   const token = cookieStore.get('token')?.value;

//   if (!token) return null;

//   try {
//     return jwt.verify(token, JWT_SECRET) as JwtPayload;
//   } catch (err) {
//     return null;
//   }
// }

// export function hasPermission(token: JwtPayload | null, permission: string): boolean {
//   return !!token?.permissions?.includes(permission);
// }

// export function isFullAdmin(token: JwtPayload | null): boolean {
//   return token?.role === 'admin' && token?.accessLevel === 'full';
// }

// import jwt from 'jsonwebtoken';

// const JWT_SECRET = 'test-secret'; // 🔐 такий самий

// export function getClientToken(): string | null {
//   const cookie = document.cookie
//     .split('; ')
//     .find(row => row.startsWith('token='));
//   return cookie?.split('=')[1] || null;
// }

// export function parseClientToken() {
//   const token = getClientToken();
//   if (!token) return null;

//   try {
//     return jwt.verify(token, JWT_SECRET);
//   } catch {
//     return null;
//   }
// }

