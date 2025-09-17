


// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import jwt from 'jwt-simple';
// import { authenticateAdmin } from '@/utils/authenticateAdmin';

// const JWT_SECRET = 'your-secret';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();
//   const [error, setError] = useState('');

// //  useEffect(() => {
// //   if (typeof window !== 'undefined') {
// //     const token = Cookies.get('token');
// //     if (token) {
// //       try {
// //         jwt.decode(token, JWT_SECRET);
// //         window.location.href = '/admin'; 
// //       } catch {
// //         Cookies.remove('token');
// //       }
// //     }
// //   }
// // }, []);
// useEffect(() => {
//     const token = Cookies.get('token');
//     if (token) {
//       try {
//         jwt.decode(token, JWT_SECRET);
//         router.replace('/admin'); // без повного reload
//       } catch {
//         Cookies.remove('token');
//       }
//     }
//     // setLoading(false);
//   }, [router]);

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();

//     const user = authenticateAdmin(email, password);

//     if (!user) {
//       setError('Невірний email або пароль');
//       return;
//     }

//     const payload = {
//       sub: user.id,
//       email: user.email,
//       role: user.role,
//       permissions: user.permissions,
//       clubId: user.clubId ?? null,
//       exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
//     };

//     const token = jwt.encode(payload, JWT_SECRET);
// Cookies.set('token', token, { expires: 1, path: '/' });

    
//    if (user.role === 'club_admin') {
//   // window.location.href = `/admin/${user.clubId}`;
//   router.push(`/admin/${user.clubId}`);
// } else {
//   // window.location.href = '/admin';
//   router.push('/admin');
// }
//   };
//   router.refresh();

//   return (
//     <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-10 flex flex-col gap-4">
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={e => setEmail(e.target.value)}
//         required
//         className="border p-2"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//         required
//         className="border p-2"
//       />
//       {error && <p className="text-red-500">{error}</p>}
//       <button type="submit" className="bg-blue-600 text-white p-2 rounded">
//         Login
//       </button>
//     </form>
//   );
// }


//===================  Working version ===================


// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import jwt from 'jwt-simple';
// import { authenticateAdmin } from '@/utils/authenticateAdmin';

// const JWT_SECRET = 'your-secret';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();

//   useEffect(() => {
//     const token = Cookies.get('token');
//     if (token) {
//       try {
//         jwt.decode(token, JWT_SECRET);
//         router.replace('/admin'); // без повного reload
//       } catch {
//         Cookies.remove('token');
//       }
//     }
//     setLoading(false);
//   }, [router]);

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();

//     const user = authenticateAdmin(email, password);

//     if (!user) {
//       setError('Невірний email або пароль');
//       return;
//     }

//     const payload = {
//       sub: user.id,
//       email: user.email,
//       role: user.role,
//       permissions: user.permissions,
//       clubId: user.clubId ?? null,
//       exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
//     };

//     const token = jwt.encode(payload, JWT_SECRET);
//     Cookies.set('token', token, { expires: 1, path: '/' });

//     if (user.role === 'club_admin') {
//       router.push(`/admin/${user.clubId}`);
//     } else {
//       router.push('/admin');
//     }
//     router.refresh(); // оновлює серверні дані
//   };

//   if (loading) return null; // або спінер

//   return (
//     <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-10 flex flex-col gap-4">
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={e => setEmail(e.target.value)}
//         required
//         className="border p-2"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//         required
//         className="border p-2"
//       />
//       {error && <p className="text-red-500">{error}</p>}
//       <button type="submit" className="bg-blue-600 text-white p-2 rounded">
//         Login
//       </button>
//     </form>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);


const r = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

console.log("STATUS:", r.status);
const raw = await r.clone().text(); 
console.log("RAW RESPONSE:", raw);

if (!r.ok) {
  const { error } = JSON.parse(raw || "{}");
  setError(error || "Помилка входу");
  setPending(false);
  return;
}


const data = await r.json();


    setPending(false);

    if (!r.ok) {
      const { error } = await r.json().catch(() => ({ error: "Помилка входу" }));
      setError(error || "Помилка входу");
      return;
    }

   
    const { user } = await r.json().catch(() => ({ user: null }));

    if (user?.role === "club_admin" && user?.clubId) {
      router.replace(`/admin/${user.clubId}`);
    } else {
      router.replace("/admin");
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="border p-2"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button disabled={pending} type="submit" className="bg-blue-600 text-white p-2 rounded">
        {pending ? "Вхід..." : "Login"}
      </button>
    </form>
  );
}

