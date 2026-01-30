// // lib/auth-context.server.ts
// import 'server-only';

// import { cookies } from 'next/headers';
// import { decodeJwt } from 'jose';
// import { redirect, notFound } from 'next/navigation';

// // клейми як у middleware
// const ROLE_CLAIM =
//   'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
// const NAMEID_CLAIM =
//   'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

// const isTrue = (v: unknown) => v === true || v === 'true' || v === 'True';

// export type AuthContext = {
//   token: string;
//   role?: string;
//   userId?: string;
//   clubId?: string;
//   isAdmin: boolean;
//   raw: any;
// };

// /** Просто пробує прочитати й розпарсити токен. НІЧОГО не редіректить. */
// export function getAuthContext(): AuthContext | null {
//   const token = cookies().get('token')?.value;
//   if (!token) return null;

//   const payload: any = decodeJwt(token);

//   return {
//     token,
//     role: (payload[ROLE_CLAIM] as string | undefined) ?? payload.role,
//     userId: (payload[NAMEID_CLAIM] as string | undefined) ?? payload.sub,
//     clubId: payload.clubId as string | undefined,
//     isAdmin: isTrue(payload.isAdmin),
//     raw: payload,
//   };
// }

// /**
//  * Використовуй у server page.
//  * Якщо немає/битий токен → редірект на логін.
//  */
// export function requireAuth(locale?: string): AuthContext {
//   const loginPath = locale ? `/${locale}/login` : '/login';

//   try {
//     const auth = getAuthContext();
//     if (!auth) redirect(loginPath);
//     return auth;
//   } catch {
//     redirect(loginPath);
//   }
// }

// /** ====== Булеві хелпери (для кнопок/частин UI) ====== */

// export function isClubAdmin(auth: AuthContext) {
//   return !!auth.clubId && !auth.isAdmin;
// }

// export function canEditClub(auth: AuthContext) {
//   // твоя бізнес-логіка: редагувати клуб може тільки супер-адмін
//   return auth.isAdmin === true;
// }

// /** ====== Гварди (для блокування сторінок) ====== */

// export function requireAdmin(auth: AuthContext) {
//   if (!auth.isAdmin) notFound(); // або redirect(...)
// }

// export function requireNotClubAdmin(auth: AuthContext) {
//   // якщо зайшов club admin — блокуємо
//   if (isClubAdmin(auth)) notFound();
// }

// /**
//  * Якщо сторінка прив’язана до clubId з URL:
//  * - супер адмін може все
//  * - club admin тільки свій clubId
//  */
// export function requireClubAccess(auth: AuthContext, clubIdFromParams: string) {
//   if (auth.isAdmin) return;
//   if (!auth.clubId) notFound();
//   if (auth.clubId !== clubIdFromParams) notFound();
// }
