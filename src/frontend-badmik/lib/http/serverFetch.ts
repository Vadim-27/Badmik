// src/lib/http/serverFetch.ts
import 'server-only';
import { cookies } from 'next/headers';

const ORIGIN = process.env.BACKEND_ORIGIN!.replace(/\/$/, '');

// ✅ бек тепер з версією
const API_BASE = '/api/v1';

function buildUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;

  // якщо ORIGIN вже містить /api або /api/v1 — не дублюємо
  const originHasApi = /\/api(\/v\d+)?$/.test(ORIGIN);

  return originHasApi ? `${ORIGIN}${p}` : `${ORIGIN}${API_BASE}${p}`;
}

// ✅ беремо тип next напряму з RequestInit, щоб не було конфлікту типів
type NextOpts = RequestInit extends { next?: infer N } ? N : never;

export async function serverFetch(path: string, init: RequestInit = {}, next?: NextOpts) {
  const url = buildUrl(path);

  const reqId = Math.random().toString(36).slice(2, 10);
  const method = (init.method ?? 'GET').toUpperCase();

  // ✅ headers через Headers (без union-каші)
  const h = new Headers(init.headers);

  // ✅ токен в SSR
  const token = (await cookies()).get('token')?.value ?? null;
  if (token && !h.has('authorization')) {
    h.set('authorization', `Bearer ${token}`);
  }

  const hasBody = typeof init.body !== 'undefined' && init.body !== null;
  if (hasBody && !h.has('content-type')) {
    h.set('content-type', 'application/json');
  }

  const finalInit: RequestInit = {
    ...init,
    headers: h,
  };

  // ✅ next опції (ISR/tags) — передаємо як є
  if (next) {
    (finalInit as any).next = next;
    delete (finalInit as any).cache;
  } else if (!('cache' in finalInit)) {
    finalInit.cache = 'no-store';
  }

  // // ===== ЛОГИ ДО ЗАПИТУ =====
  // console.log(`[SSR FETCH ▶][${reqId}] ${method} ${url}`);
  // console.log(`[SSR FETCH ▶][${reqId}] hasAuth=${h.has('authorization')} hasBody=${hasBody}`);

  const res = await fetch(url, finalInit);

  // ===== ЛОГИ ПІСЛЯ =====
  // console.log(`[SSR FETCH ◀][${reqId}] ${res.status} ${res.statusText} ${url}`);

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.log(`[SSR FETCH ◀][${reqId}] body:`, body.slice(0, 1500)); // щоб не засрати консоль
    if (res.status === 401) throw new Error(`UNAUTHORIZED: ${url}`);
    throw new Error(`API ${res.status}: ${url}\n${body}`);
  }

  return res;
}

//=================================================


// src/lib/http/serverFetch.ts
// import 'server-only';

// const ORIGIN = process.env.BACKEND_ORIGIN!.replace(/\/$/, '');
// const API_BASE = '/api/v1';

// function buildUrl(path: string) {
//   const hasApi = /\/api$/.test(ORIGIN);
//   const p = path.startsWith('/') ? path : `/${path}`;
//   return hasApi ? `${ORIGIN}${p}` : `${ORIGIN}${API_BASE}${p}`;
// }

// // Узгоджено з Next.js fetch options
// type NextOpts = { revalidate?: number | false; tags?: string[] };

// export async function serverFetch(
//   path: string,
//   init: RequestInit = {},
//   next?: NextOpts
// ) {
//   const url = buildUrl(path);

//   // Нормалізуємо headers
//   const h = new Headers(init.headers as HeadersInit | undefined);
//   const hasBody = typeof init.body !== 'undefined' && init.body !== null;
//   if (hasBody && !h.has('Content-Type')) {
//     h.set('Content-Type', 'application/json');
//   }

//   const finalInit: RequestInit & { next?: NextOpts } = {
//     ...init,
//     headers: h,
//   };

//   if (next) {
//     finalInit.next = next;          // ISR/теги
   
//     delete (finalInit as any).cache;
//   } else if (!('cache' in finalInit)) {
//     finalInit.cache = 'no-store';   // твоя стара дефолтна поведінка
//   }

//   const res = await fetch(url, finalInit);

//   if (res.status === 401) throw new Error(`UNAUTHORIZED: ${url}`);
//   if (!res.ok) {
//     const body = await res.text().catch(() => '');
//     throw new Error(`API ${res.status}: ${url}\n${body}`);
//   }
//   return res;
// }




//==================================================


// // src/lib/http/serverFetch.ts
// import "server-only";
// import { cookies } from "next/headers";

// const ORIGIN = process.env.BACKEND_ORIGIN!.replace(/\/$/, "");
// const API_BASE = "/api"; // твій бекенд-префікс

// function buildUrl(path: string) {
//   const hasApi = /\/api$/.test(ORIGIN);
//   const p = path.startsWith("/") ? path : `/${path}`;
//   return hasApi ? `${ORIGIN}${p}` : `${ORIGIN}${API_BASE}${p}`;
// }

// export async function serverFetch(path: string, init: RequestInit = {}) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   const url = buildUrl(path);
//   const res = await fetch(url, {
//     ...init,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(init.headers || {}),
//     },
//     cache: "no-store",
//   });

//   if (res.status === 401) throw new Error(`UNAUTHORIZED: ${url}`);
//   if (!res.ok) {
//     const body = await res.text().catch(() => "");
//     throw new Error(`API ${res.status}: ${url}\n${body}`);
//   }
//   return res;
// }

