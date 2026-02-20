
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import HeaderClient from "./HeaderClient/HeaderClient";
import { staffServerQueries } from "@/services/staff/queries.server";
import { prefetch } from "@/services/_shared/prefetch";
import RQHydrate from "@/services/_shared/RQHydrate";

const ROLE_CLAIM   = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const NAMEID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

export default async function Header() {
  const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

  let isAuthenticated = false;
  let role: string | undefined;
  let userId: string | undefined;
  let email: string | undefined;
  let avatarUrl: string | undefined;

  if (token) {
    try {
      const p: any = decodeJwt(token); 
      role     = p[ROLE_CLAIM] ?? p.role;
      userId   = p[NAMEID_CLAIM] ?? p.sub;
      email    = p.email;
      avatarUrl = p.avatarUrl;
      isAuthenticated = true;
    } catch {
      // битий/протух токен — вважаємо неавторизованим
    }
  }

  const state = await prefetch([
    ...(userId ? [staffServerQueries.byUserId(userId)] : []),
  ]);

  return (
     <RQHydrate state={state}>
    <HeaderClient
      isAuthenticated={isAuthenticated}
      role={role}
      userId={userId}
      email={email}
      avatarUrl={avatarUrl}
    />
    </RQHydrate>
  );
}

