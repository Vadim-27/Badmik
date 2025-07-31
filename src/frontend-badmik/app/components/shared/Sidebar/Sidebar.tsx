'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jwt-simple';
import { useParams } from 'next/navigation';
import SidebarLink from './SidebarLink/SidebarLink';

const drawerWidthOpen = 240;
const drawerWidthClosed = 60;
const JWT_SECRET = 'your-secret';

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [clubIdFromToken, setClubIdFromToken] = useState<string | null>(null);
  const params = useParams();

  const toggleDrawer = () => setOpen(!open);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwt.decode(token, JWT_SECRET);
        setRole(decoded.role || null);
        setClubIdFromToken(decoded.clubId || null);
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  const effectiveClubId =
    role === 'club_admin'
      ? clubIdFromToken
      : typeof params.clubId === 'string'
        ? params.clubId
        : null;

  if (role === null) return null;

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
            <>
              <SidebarLink href="/admin/settings/" open={open}>
                {open ? 'Settings' : '⚙️'}
              </SidebarLink>

              <SidebarLink href="/admin/users/" open={open}>
                {open ? 'Users' : '👤'}
              </SidebarLink>

              <SidebarLink href="/admin/add-club/" open={open}>
                {open ? 'Add Club' : '🏸➕'}
              </SidebarLink>
            </>
          )}

          {effectiveClubId && (
            <>
            <SidebarLink href={`/admin/${effectiveClubId}/bookings/`} open={open}>
              {open ? 'Bookings' : '🏟️'}
            </SidebarLink>
            <SidebarLink href={`/admin/${effectiveClubId}/usersClub/`} open={open}>
              {open ? 'UsersClub' : '👥🎾'}
            </SidebarLink>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
