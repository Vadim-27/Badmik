// // app/components/shared/Sidebar/Sidebar.tsx

// //====================
// import { cookies } from "next/headers";
// import { decodeJwt } from "jose";
// import SidebarClient from "./SidebarClient/SidebarClient";

// const ROLE_CLAIM   = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
// const NAMEID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

// export default async function Sidebar() {
//   const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
    

//   let role: string | undefined;
//   let userId: string | undefined;
//   let email: string | undefined;
//   let isAdmin: boolean | undefined;
//   let clubId: string | undefined;

//   if (token) {
//     try {
//     const payload: any = decodeJwt(token);

//     role   = payload[ROLE_CLAIM] ?? payload.role;
//     userId = payload[NAMEID_CLAIM] ?? payload.sub;
//     clubId = payload.clubId as string | undefined;   
//     isAdmin =
//       payload.isAdmin === true ||
//       payload.isAdmin === 'True' ||
//       payload.isAdmin === 'true';

//     email  = payload.email;
//   }  catch {
//       // токен битий/прострочений — можна повернути null, і хай клієнтський сайдбар сховається
//     }
//   }

//   return <SidebarClient role={role} userId={userId} isAdmin={isAdmin} clubId={clubId} email={email} />;
// }

// app/components/shared/Sidebar/Sidebar.tsx
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';

import SidebarClient from './SidebarClient/SidebarClient';

// ✅ додали
import { prefetch } from '@/services/_shared/prefetch';
import RQHydrate from '@/services/_shared/RQHydrate';
import { locationsServerQueries } from '@/services/locations/queries.server';

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const NAMEID_CLAIM =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

export default async function Sidebar() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let role: string | undefined;
  let userId: string | undefined;
  let email: string | undefined;
  let isAdmin: boolean | undefined;
  let clubId: string | undefined;

  if (token) {
    try {
      const payload: any = decodeJwt(token);

      role = payload[ROLE_CLAIM] ?? payload.role;
      userId = payload[NAMEID_CLAIM] ?? payload.sub;
      clubId = payload.clubId as string | undefined;

      isAdmin =
        payload.isAdmin === true ||
        payload.isAdmin === 'True' ||
        payload.isAdmin === 'true';

      email = payload.email;
    } catch {
      // ignore
    }
  }

  // ✅ Prefetch locations тільки якщо є clubId в токені (тобто staff, не admin)
  const clubIdByToken = !isAdmin ? clubId : undefined;

  if (clubIdByToken) {
    const dehydratedState = await prefetch([
      locationsServerQueries.listByClub(clubIdByToken),
    ]);

    return (
      <RQHydrate state={dehydratedState}>
        <SidebarClient
          role={role}
          userId={userId}
          isAdmin={isAdmin}
          clubId={clubId}
          email={email}
        />
      </RQHydrate>
    );
  }
}
