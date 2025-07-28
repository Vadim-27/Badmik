

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import jwt from 'jwt-simple';

const drawerWidthOpen = 240;
const drawerWidthClosed = 60;
const JWT_SECRET = 'your-secret';

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [clubId, setClubId] = useState<string | null>(null);

  const toggleDrawer = () => setOpen(!open);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwt.decode(token, JWT_SECRET);
        setRole(decoded.role || null);
        setClubId(decoded.clubId || null);
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  return (
    <div className="flex h-screen">
      <nav
        style={{ width: open ? drawerWidthOpen : drawerWidthClosed }}
        className="flex flex-col bg-gray-100 border-r border-gray-300 transition-[width] duration-300 overflow-hidden"
        aria-label="Sidebar navigation"
      >
        <button
          onClick={toggleDrawer}
          className="m-2 p-2 rounded hover:bg-gray-300 focus:outline-none"
          aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex flex-col mt-4 space-y-2 px-2">
         
         

          
          {(role === 'owner_admin' || role === 'assistant') && (
            <Link
              href="/admin/settings"
              className="block px-4 py-2 rounded cursor-pointer bg-gray-200 hover:bg-blue-500 hover:text-white transition"
              title="Settings"
            >
              {open ? 'Settings' : '⚙️'}
            </Link>
          )}

        
          {(role === 'owner_admin' || role === 'assistant') && (
            <Link
              href="/admin/users"
              className="block px-4 py-2 rounded cursor-pointer bg-gray-200 hover:bg-blue-500 hover:text-white transition"
              title="User"
            >
              {open ? 'Users' : '👤'}
            </Link>
          )}

           {/* {role === 'club_admin' && clubId && ( */}
            <Link
              href={`/admin/${clubId}`}
              className="block px-4 py-2 rounded cursor-pointer bg-gray-200 hover:bg-blue-500 hover:text-white transition"
              title="My club"
            >
              {open ? 'My club' : '🏟️'}
            </Link>
          {/* )} */}
        </div>
      </nav>
    </div>
  );
}


