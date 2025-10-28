// // src/lib/http/serverFetch.ts
// import 'server-only';

// const ORIGIN = process.env.BACKEND_ORIGIN!.replace(/\/$/, '');
// const API_BASE = '/api';

// function buildUrl(path: string) {
//   const hasApi = /\/api$/.test(ORIGIN);
//   const p = path.startsWith('/') ? path : `/${path}`;
//   return hasApi ? `${ORIGIN}${p}` : `${ORIGIN}${API_BASE}${p}`;
// }

// // Тип next як у Next.js fetch: { revalidate?: number; tags?: string[] }
// type NextOpts = { revalidate?: number; tags?: string[] };

// export async function serverFetch(
//   path: string,
//   init: RequestInit = {},
//   next?: NextOpts
// ) {
//   const url = buildUrl(path);

//   // формуємо headers: Content-Type додаємо лише якщо є body і не задано вручну
//   const hasBody = typeof init.body !== 'undefined' && init.body !== null;
//   const headers = {
//     ...(hasBody && !('Content-Type' in (init.headers ?? {})) ? { 'Content-Type': 'application/json' } : {}),
//     ...(init.headers || {}),
//   };

//   // гнучка стратегія кешу:
//   // - якщо передали next → віддаємо керування ISR/тегам
//   // - якщо НЕ передали next і НЕ передали cache → дефолтно no-store (як у тебе)
//   const finalInit: RequestInit & { next?: NextOpts } = {
//     ...init,
//     headers,
//   };

//   if (next) {
//     finalInit.next = next;         // увімкне ISR/теги
//     delete (finalInit as any).cache;
//   } else if (!('cache' in finalInit)) {
//     finalInit.cache = 'no-store';  // поведінка як у твоїй версії
//   }

//   const res = await fetch(url, finalInit);

//   if (res.status === 401) throw new Error(`UNAUTHORIZED: ${url}`);
//   if (!res.ok) {
//     const body = await res.text().catch(() => '');
//     throw new Error(`API ${res.status}: ${url}\n${body}`);
//   }
//   return res;
// }


//=================================================


// src/lib/http/serverFetch.ts
import 'server-only';

const ORIGIN = process.env.BACKEND_ORIGIN!.replace(/\/$/, '');
const API_BASE = '/api';

function buildUrl(path: string) {
  const hasApi = /\/api$/.test(ORIGIN);
  const p = path.startsWith('/') ? path : `/${path}`;
  return hasApi ? `${ORIGIN}${p}` : `${ORIGIN}${API_BASE}${p}`;
}

// Узгоджено з Next.js fetch options
type NextOpts = { revalidate?: number | false; tags?: string[] };

export async function serverFetch(
  path: string,
  init: RequestInit = {},
  next?: NextOpts
) {
  const url = buildUrl(path);

  // Нормалізуємо headers
  const h = new Headers(init.headers as HeadersInit | undefined);
  const hasBody = typeof init.body !== 'undefined' && init.body !== null;
  if (hasBody && !h.has('Content-Type')) {
    h.set('Content-Type', 'application/json');
  }

  const finalInit: RequestInit & { next?: NextOpts } = {
    ...init,
    headers: h,
  };

  if (next) {
    finalInit.next = next;          // ISR/теги
   
    delete (finalInit as any).cache;
  } else if (!('cache' in finalInit)) {
    finalInit.cache = 'no-store';   // твоя стара дефолтна поведінка
  }

  const res = await fetch(url, finalInit);

  if (res.status === 401) throw new Error(`UNAUTHORIZED: ${url}`);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${url}\n${body}`);
  }
  return res;
}




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

