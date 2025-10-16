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


//==================================================

// import "server-only";
// import { cookies } from "next/headers";

// const API = process.env.BACKEND_ORIGIN!;

// export async function serverFetch(path: string, init: RequestInit = {}) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   const res = await fetch(`${API}${path}`, {
//     ...init,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(init.headers || {}),
//     },
//     cache: "no-store",
//   });

//   if (res.status === 401) throw new Error("UNAUTHORIZED");
//   if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
//   return res;
// }


//==================================================


// src/lib/http/serverFetch.ts
import "server-only";
import { cookies } from "next/headers";

const ORIGIN = process.env.BACKEND_ORIGIN!.replace(/\/$/, "");
const API_BASE = "/api"; // твій бекенд-префікс

function buildUrl(path: string) {
  const hasApi = /\/api$/.test(ORIGIN);
  const p = path.startsWith("/") ? path : `/${path}`;
  return hasApi ? `${ORIGIN}${p}` : `${ORIGIN}${API_BASE}${p}`;
}

export async function serverFetch(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const url = buildUrl(path);
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (res.status === 401) throw new Error(`UNAUTHORIZED: ${url}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${url}\n${body}`);
  }
  return res;
}

