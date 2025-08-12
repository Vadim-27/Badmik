


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


//===================


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import jwt from 'jwt-simple';
import { authenticateAdmin } from '@/utils/authenticateAdmin';

const JWT_SECRET = 'your-secret';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        jwt.decode(token, JWT_SECRET);
        router.replace('/admin'); // без повного reload
      } catch {
        Cookies.remove('token');
      }
    }
    setLoading(false);
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = authenticateAdmin(email, password);

    if (!user) {
      setError('Невірний email або пароль');
      return;
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      clubId: user.clubId ?? null,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };

    const token = jwt.encode(payload, JWT_SECRET);
    Cookies.set('token', token, { expires: 1, path: '/' });

    if (user.role === 'club_admin') {
      router.push(`/admin/${user.clubId}`);
    } else {
      router.push('/admin');
    }
    router.refresh(); // оновлює серверні дані
  };

  if (loading) return null; // або спінер

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-10 flex flex-col gap-4">
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
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
}

