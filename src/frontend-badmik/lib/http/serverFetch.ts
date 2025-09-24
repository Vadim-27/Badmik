// import "server-only";
// import { cookies } from "next/headers";

// const API_URL = process.env.API_URL!;

// export async function serverFetch(path: string, init: RequestInit = {}) {
//  const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
//   const res = await fetch(`${API_URL}${path}`, {
//     ...init,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(init.headers || {}),
//     },
//     cache: "no-store",
//   });

//   // простий хендл 401 (тут же можна викликати refresh)
//   if (res.status === 401) {
//     throw new Error("UNAUTHORIZED");
    
//   }
//   if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
//   return res;
// }


import "server-only";
import { cookies } from "next/headers";

const API = process.env.BACKEND_ORIGIN!;

export async function serverFetch(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res;
}

