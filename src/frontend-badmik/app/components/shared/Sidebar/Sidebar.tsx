'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jwt-simple';
import { useParams } from 'next/navigation';
import SidebarLink from './SidebarLink/SidebarLink';
import { useTranslations } from 'next-intl';
import styles from './Sidebar.module.scss';

const drawerWidthOpen = 240;
const drawerWidthClosed = 60;
const JWT_SECRET = 'your-secret';

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [clubIdFromToken, setClubIdFromToken] = useState<string | null>(null);
  const params = useParams();

  const t = useTranslations('Sidebar');

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
        // className="flex flex-col bg-gray-100 border-r border-gray-300 transition-[width] duration-300 overflow-hidden"
        className={styles.sidebar}
        aria-label="Sidebar navigation"
      >
        <button
          onClick={toggleDrawer}
          className={styles.buttonToggleMenu}
          aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
        >
          {open ? <div className={styles.wrapperButtonToggleMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg> 
          <p className ={styles.role}>Admin</p>
          </div> : <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>}
        </button>

        <p className={styles.nameNavBlock}>Основне</p>

        <div className="flex flex-col mt-4 space-y-2 px-2">
          {(role === 'owner_admin' || role === 'assistant') && (
            <>
              <SidebarLink href="/admin/dashboar" open={open}>
                {open ? t('DashboardMain') : '🏠'}
              </SidebarLink>
              <SidebarLink href="/admin/settings/" open={open}>
                {open ? t('Settings') : '⚙️'}
              </SidebarLink>


              <SidebarLink href="/admin/users/" open={open}>
                {open ? t('Players') : '👤'}
              </SidebarLink>

              
               {effectiveClubId && (
            <div className="px-4">
            <SidebarLink href={`/admin/${effectiveClubId}/bookings/`} open={open}>
              {open ? t('Bookings') : '🏟️'}
            </SidebarLink>
            <SidebarLink href={`/admin/${effectiveClubId}/usersClub/`} open={open}>
              {open ? t('UsersClub') : '👥🎾'}
            </SidebarLink>
            </div>
          )}



              <SidebarLink href="/admin/access-control/" open={open}>
                {open ? t('AccessControl') : '🔐'}
              </SidebarLink>
              <SidebarLink href="/admin/messages/" open={open}>
                {open ? t('Messages') : '💬'}
              </SidebarLink>
              <SidebarLink href="/admin/news/" open={open}>
                {open ? t('News') : '📰'}
              </SidebarLink>
              <SidebarLink href="/admin/analytics/" open={open}>
                {open ? t('Analytics') : '📊'}
              </SidebarLink>
              <SidebarLink href="/admin/logs/" open={open}>
                {open ? t('Log') : '📜'}
              </SidebarLink>

              {/* <SidebarLink href="/admin/add-club/" open={open}>
                {open ? 'Add Club' : '🏸➕'}
              </SidebarLink> */}
            </>
          )}

          {/* {effectiveClubId && (
            <>
            <SidebarLink href={`/admin/${effectiveClubId}/bookings/`} open={open}>
              {open ? t('Bookings') : '🏟️'}
            </SidebarLink>
            <SidebarLink href={`/admin/${effectiveClubId}/usersClub/`} open={open}>
              {open ? t('UsersClub') : '👥🎾'}
            </SidebarLink>
            </>
          )} */}
        </div>
      </nav>
    </div>
  );
}
