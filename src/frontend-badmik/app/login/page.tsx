

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from '@/node_modules/@types/js-cookie';
import jwt from 'jwt-simple';

const JWT_SECRET = 'your-secret'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');

  
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        jwt.decode(token, JWT_SECRET);
        router.replace('/'); 
      } catch {
        
        Cookies.remove('token');
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    let payload;

    if (email === 'admin@example.com') {
      payload = {
        sub: 'user-id',
        email,
        role: 'admin',
        accessLevel: 'full',
        permissions: ['admin_dashboard','view_users', 'manage_settings'],
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      };
    } else if (email === 'admin2@example.com') {
      payload = {
        sub: 'user-id',
        email,
        role: 'admin2',
        accessLevel: 'limited',
        permissions: ['admin_dashboard', 'view_users'],
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      };
    } else {
      setError('Unknown user');
      return;
    }

    const token = jwt.encode(payload, JWT_SECRET);
    Cookies.set('token', token, { expires: 1, path: '/' });

    window.location.href = '/'; 
  };

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
