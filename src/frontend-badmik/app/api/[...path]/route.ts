
// app/api/[...path]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Agent, setGlobalDispatcher } from "undici";

if (process.env.NODE_ENV !== "production") {
  // dev-сертифікати
  setGlobalDispatcher(new Agent({ connect: { rejectUnauthorized: false } }));
}

const ORIGIN = process.env.BACKEND_ORIGIN ?? "https://127.0.0.1:61804";

const STRIP_API_PREFIX = process.env.STRIP_API_PREFIX === "1";

function joinUrl(origin: string, path: string, search = "") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return new URL(p + (search || ""), origin);
}

function normalizePathname(pathname: string) {
  let p = pathname; 
  if (STRIP_API_PREFIX && p.startsWith("/api")) {
    p = p.slice(4) || "/";
  }
  return p;
}

export async function forward(req: NextRequest) {
  const reqId =
    req.headers.get("x-request-id") || Math.random().toString(36).slice(2, 10);

  try {
    const token = (await cookies()).get("token")?.value ?? null;

    // шлях, як прийшов від клієнта (без маніпуляцій зі слешем)
    const upstreamPath = normalizePathname(req.nextUrl.pathname);
    const upstreamUrl = joinUrl(ORIGIN, upstreamPath, req.nextUrl.search);

    const method = (req.method || "GET").toUpperCase();
    const hasBody = method !== "GET" && method !== "HEAD";
    const bodyBuf = hasBody ? await req.arrayBuffer() : undefined;

    // console.log(
    //   `[PROXY ▶][${reqId}] ${method} ${req.nextUrl.pathname}${req.nextUrl.search}`
    // );
    // console.log(`[PROXY ↣][${reqId}] → ${upstreamUrl.toString()}`);

    // головне: слідуємо за редіректами тут, а не прокидаємо їх у браузер
    let res = await fetch(upstreamUrl, {
      method,
      body: hasBody ? bodyBuf : undefined,
      cache: "no-store",
      redirect: "follow",
      headers: {
        "Content-Type": req.headers.get("content-type") ?? "application/json",
        "x-request-id": reqId,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    // console.log(`[PROXY ◀][${reqId}] ${res.status} ${res.statusText}`);

    // Перепаковуємо заголовки (прибираємо те, що може ламати стрім)
    const hdrs = new Headers(res.headers);
    hdrs.delete("transfer-encoding");
    hdrs.delete("content-encoding"); // Next сам виставить
    hdrs.delete("location");         // ми вже пройшли редірект
    hdrs.delete("refresh");
    hdrs.set("x-proxy", "next-proxy");
    hdrs.set("x-request-id", reqId);

    return new NextResponse(res.body, { status: res.status, headers: hdrs });
  } catch (e: any) {
    console.error(`[PROXY ✖][${reqId}]`, e?.name, e?.message);
    return NextResponse.json(
      { proxyError: true, message: e?.message, requestId: reqId },
      { status: 502 }
    );
  }
}

export {
  forward as GET,
  forward as POST,
  forward as PUT,
  forward as PATCH,
  forward as DELETE,
  forward as HEAD,
};



