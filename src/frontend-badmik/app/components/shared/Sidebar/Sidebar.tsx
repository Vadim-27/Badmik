'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const drawerWidthOpen = 240;
const drawerWidthClosed = 60;

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => setOpen(!open);

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
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

      
        <div className="flex flex-col mt-4 space-y-2 px-2">
          <Link
            href="/admin/settings"
            className="block px-4 py-2 rounded cursor-pointer bg-gray-200 hover:bg-blue-500 hover:text-white transition"
            title="Settings"
          >
            {open ? 'Settings' : '⚙️'}
          </Link>
          <Link
            href="/admin/users"
            className="block px-4 py-2 rounded cursor-pointer bg-gray-200 hover:bg-blue-500 hover:text-white transition"
            title="User"
          >
            {open ? 'User' : '👤'}
          </Link>
        </div>
      </nav>

      
      <main className="flex-grow p-4">
        {/* Основний контент сторінки */}
      </main>
    </div>
  );
}

