
// app/api/auth/login/route.ts
// app/api/auth/login/route.ts
// import { NextResponse } from "next/server";

// const LOGIN_PATH = "/api/Auth/login"; // звір у Swagger

// export async function POST(req: Request) {
//   console.log("[AUTH] API_URL:", process.env.API_URL, "PATH:", LOGIN_PATH);
//   try {
//     const body = await req.json();

//     // тимчасово логнемо payload (обережно з паролем у проді)
//     console.log("[AUTH] payload:", body);

//     const res = await fetch(`${process.env.API_URL}${LOGIN_PATH}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//       cache: "no-store",
//     });

//     const raw = await res.text(); // читаємо один раз
//     console.log("[AUTH] backend status:", res.status);
//     console.log("[AUTH] backend raw:", raw);

//     if (!res.ok) {
//       // повертаємо далі, щоб у клієнті бачити текст помилки
//       return NextResponse.json(
//         { error: raw || "Login failed", status: res.status },
//         { status: res.status }
//       );
//     }

//     // якщо бек повертає JSON
//     let data: any = {};
//     try { data = raw ? JSON.parse(raw) : {}; } catch { /* не JSON */ }

//     const response = NextResponse.json({ ok: true, user: data.user ?? null });

//     if (data.accessToken) {
//       response.cookies.set("token", data.accessToken, {
//         httpOnly: true, secure: true, sameSite: "lax", path: "/",
//       });
//     }
//     if (data.refreshToken) {
//       response.cookies.set("refreshToken", data.refreshToken, {
//         httpOnly: true, secure: true, sameSite: "lax", path: "/",
//       });
//     }

//     return response;
//   } catch (e: any) {
//     console.error("[AUTH] route error:", e);
//     return NextResponse.json({ error: "Internal error" }, { status: 500 });
//   }
// }

//================================

import { NextResponse } from "next/server";

const LOGIN_PATH = "/api/Auth/login"; // зі Swagger

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const r = await fetch(`${process.env.API_URL}${LOGIN_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const raw = await r.text();
    if (!r.ok) {
      return NextResponse.json({ error: raw || "Login failed" }, { status: r.status });
    }

    // Бек повертає { token, refreshToken, expiresAt, role, userId, ... }
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
      // можна виставити термін дії за expiresAt або maxAge
      const cookieOpts: Parameters<typeof res.cookies.set>[2] = {
        httpOnly: true,
        secure: isProd,       // на localhost має бути false
        sameSite: "lax",
        path: "/",
      };
      if (expiresAt) {
        const expDate = new Date(expiresAt); // з бекенду ISO-рядок
        if (!Number.isNaN(expDate.getTime())) cookieOpts.expires = expDate;
      } else {
        cookieOpts.maxAge = 60 * 60; // 1 год — запасний варіант
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

