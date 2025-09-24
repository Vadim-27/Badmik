import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ORIGIN = process.env.BACKEND_ORIGIN!;

async function forward(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  
  const path = req.nextUrl.pathname.replace(/^\/api/, "");
  const url = new URL(path + (req.nextUrl.search || ""), ORIGIN);

  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await req.text() : undefined;

  const res = await fetch(url, {
    method,
    body,
    headers: {
      "Content-Type": req.headers.get("content-type") || "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const buf = await res.arrayBuffer();
  const out = new NextResponse(buf, { status: res.status });
  res.headers.forEach((v, k) => {
    if (!["transfer-encoding"].includes(k.toLowerCase())) out.headers.set(k, v);
  });
  return out;
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
export const HEAD = forward;
