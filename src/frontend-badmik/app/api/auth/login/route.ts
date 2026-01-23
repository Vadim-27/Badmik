

import { NextResponse } from "next/server";

const LOGIN_PATH = "/api/Auth/login"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const r = await fetch(`${process.env.BACKEND_ORIGIN}${LOGIN_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const raw = await r.text();
    if (!r.ok) {
      return NextResponse.json({ error: raw || "Login failed" }, { status: r.status });
    }

    
    let data: any = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch {}

    const { token, refreshToken, expiresAt } = data;

    const res = NextResponse.json({
      ok: true,
      user: {
        id: data.userId,
        email: data.email,
        role: data.role,
        fullName: data.fullName,
      },
    });

    const isProd = process.env.NODE_ENV === "production";

    if (token) {
      
      const cookieOpts: Parameters<typeof res.cookies.set>[2] = {
        httpOnly: true,
        secure: isProd,       
        sameSite: "lax",
        path: "/",
      };
      if (expiresAt) {
        const expDate = new Date(expiresAt); 
        if (!Number.isNaN(expDate.getTime())) cookieOpts.expires = expDate;
      } else {
        cookieOpts.maxAge = 60 * 60; 
      }

      res.cookies.set("token", token, cookieOpts);
    }

    if (refreshToken) {
      res.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
      });
    }

    return res;
  } catch (e) {
    console.error("[AUTH] route error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

