'use client';

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import jwt from 'jwt-simple';

const JWT_SECRET = 'your-secret'; 

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      try {
        const decoded = jwt.decode(token, JWT_SECRET);
        const role = decoded.role;

        setIsAuthenticated(true);
        setIsAdmin(['admin', 'admin2', 'admin3'].includes(role));
      } catch (err) {
        console.error('Invalid token:', err);
        Cookies.remove('token');
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.reload();
  };

  return (
    <header className="flex justify-between items-center px-4 py-3 bg-gray-800 text-white">
      <nav className="flex gap-4 items-center">
        <Link href="/" className="hover:underline">
          Home
        </Link>

        {isAdmin && (
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>
        )}
      </nav>

      <div>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
