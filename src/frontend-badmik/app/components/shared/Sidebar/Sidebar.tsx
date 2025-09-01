// 'use client';

// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import jwt from 'jwt-simple';
// import { useParams } from 'next/navigation';
// import SidebarLink from './SidebarLink/SidebarLink';
// import { useTranslations } from 'next-intl';
// import styles from './Sidebar.module.scss';

// const drawerWidthOpen = 240;
// const drawerWidthClosed = 60;
// const JWT_SECRET = 'your-secret';

// export default function Sidebar() {
//   const [open, setOpen] = useState(true);
//   const [role, setRole] = useState<string | null>(null);
//   const [clubIdFromToken, setClubIdFromToken] = useState<string | null>(null);
//   const params = useParams();

//   const t = useTranslations('Sidebar');

//   const toggleDrawer = () => setOpen(!open);

//   useEffect(() => {
//     const token = Cookies.get('token');
//     if (token) {
//       try {
//         const decoded = jwt.decode(token, JWT_SECRET);
//         setRole(decoded.role || null);
//         setClubIdFromToken(decoded.clubId || null);
//       } catch (err) {
//         console.error('Invalid token');
//       }
//     }
//   }, []);

//   const effectiveClubId =
//     role === 'club_admin'
//       ? clubIdFromToken
//       : typeof params.clubId === 'string'
//         ? params.clubId
//         : null;

//   if (role === null) return null;

//   return (
//     <div className="flex h-screen">
//       <nav
//         style={{ width: open ? drawerWidthOpen : drawerWidthClosed }}
//         // className="flex flex-col bg-gray-100 border-r border-gray-300 transition-[width] duration-300 overflow-hidden"
//         className={styles.sidebar}
//         aria-label="Sidebar navigation"
//       >
//         <button
//           onClick={toggleDrawer}
//           className={styles.buttonToggleMenu}
//           aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
//         >
//           {open ? (
//             <div className={styles.wrapperButtonToggleMenu}>
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//               <p className={styles.role}>Admin</p>
//             </div>
//           ) : (
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           )}
//         </button>

//         <p className={styles.nameNavBlock}>Основне</p>

//         <div className="flex flex-col mt-4 space-y-2 px-2">
//           {(role === 'owner_admin' || role === 'assistant') && (
//             <>
//               <SidebarLink href="/admin/dashboar" open={open}>
//                 {open ? t('DashboardMain') : '🏠'}
//               </SidebarLink>
//               <SidebarLink href="/admin/settings/" open={open}>
//                 {open ? t('Settings') : '⚙️'}
//               </SidebarLink>

//               <SidebarLink href="/admin/users/" open={open}>
//                 {open ? t('Players') : '👤'}
//               </SidebarLink>

//               {effectiveClubId && (
//                 <div className="px-4">
//                   <SidebarLink href={`/admin/${effectiveClubId}/bookings/`} open={open}>
//                     {open ? t('Bookings') : '🏟️'}
//                   </SidebarLink>
//                   <SidebarLink href={`/admin/${effectiveClubId}/usersClub/`} open={open}>
//                     {open ? t('UsersClub') : '👥🎾'}
//                   </SidebarLink>
//                 </div>
//               )}

//               <SidebarLink href="/admin/access-control/" open={open}>
//                 {open ? t('AccessControl') : '🔐'}
//               </SidebarLink>
//               <SidebarLink href="/admin/messages/" open={open}>
//                 {open ? t('Messages') : '💬'}
//               </SidebarLink>
//               <SidebarLink href="/admin/news/" open={open}>
//                 {open ? t('News') : '📰'}
//               </SidebarLink>
//               <SidebarLink href="/admin/analytics/" open={open}>
//                 {open ? t('Analytics') : '📊'}
//               </SidebarLink>
//               <SidebarLink href="/admin/logs/" open={open}>
//                 {open ? t('Log') : '📜'}
//               </SidebarLink>

//               {/* <SidebarLink href="/admin/add-club/" open={open}>
//                 {open ? 'Add Club' : '🏸➕'}
//               </SidebarLink> */}
//             </>
//           )}

//           {/* {effectiveClubId && (
//             <>
//             <SidebarLink href={`/admin/${effectiveClubId}/bookings/`} open={open}>
//               {open ? t('Bookings') : '🏟️'}
//             </SidebarLink>
//             <SidebarLink href={`/admin/${effectiveClubId}/usersClub/`} open={open}>
//               {open ? t('UsersClub') : '👥🎾'}
//             </SidebarLink>
//             </>
//           )} */}
//         </div>
//       </nav>
//       <div className={styles.sideWrap}>
//         <input type="checkbox" className={styles.navToggle} id="navToggle" />
//         <label className={styles.collapseBtn} htmlFor="navToggle">
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//             <path d="M15 18l-6-6 6-6" />
//           </svg>
//         </label>

//         <aside className={styles.side} aria-label="Навігація">
//           <div className={styles.sideHead}>
//             <div className={styles.logo}>
//               <span className={styles.logoIcon} aria-hidden="true">
//                 <svg viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M7 3l10 4-6 6-4-10z" />
//                 </svg>
//               </span>
//               <span className={styles.title}>Адмін</span>
//             </div>
//             <span className={styles.badge} aria-label="Версія">
//               v1.0
//             </span>
//           </div>

//           <div className={styles.sideSec}>
//             <div className={styles.secTitle}>Основне</div>
//             <nav className={styles.navList}>
//               <SidebarLink className={styles.navItem} href="/admin">
//                 <svg
//                   aria-hidden="true"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M3 12h18M3 6h18M3 18h18" />
//                 </svg>
//                 <span>Дашборд</span>
//               </SidebarLink>
//               <a className={`${styles.inner} ${styles.navItem}`} href="/admin/clubs">
//                 <svg
//                   aria-hidden="true"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <rect x="3" y="4" width="7" height="7" />
//                   <rect x="14" y="4" width="7" height="7" />
//                   <rect x="14" y="15" width="7" height="7" />
//                   <rect x="3" y="15" width="7" height="7" />
//                 </svg>
//                 <span>Клуби</span>
//                 <span className={styles.count} aria-label="Кількість клубів">
//                   6
//                 </span>
//               </a>
//               <a className={styles.navItem} href="/admin/trainings">
//                 <svg
//                   aria-hidden="true"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M3 7h18M3 12h18M3 17h18" />
//                 </svg>
//                 <span>Тренування</span>
//                 <span className={styles.count}>34</span>
//               </a>
//             </nav>
//           </div>

//           <details className={styles.group} open>
//             <summary>
//               <svg
//                 aria-hidden="true"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11zM8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11z" />
//               </svg>
//               <span>Користувачі</span>
//             </summary>
//             <div className={`${styles.inner} ${styles.navList}`}>
//               <a className={styles.navItem} href="/admin/players">
//                 <svg
//                   aria-hidden="true"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zM3 22c0-3.9 4.5-7 9-7s9 3.1 9 7" />
//                 </svg>
//                 <span>Гравці</span>
//                 <span className={styles.count}>512</span>
//               </a>
//               <a className={styles.navItem} href="/admin/managers">
//                 <svg
//                   aria-hidden="true"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                   <circle cx="12" cy="7" r="4" />
//                 </svg>
//                 <span>Менеджери</span>
//                 <span className={styles.count}>12</span>
//               </a>
//             </div>
//           </details>

//           <div className={styles.sideFoot}>
//             <svg
//               aria-hidden="true"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M12 20l9-16H3l9 16z" />
//             </svg>
//             <span>Документація</span>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }


//==================================



'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jwt-simple';
import { useParams } from 'next/navigation';
import SidebarLink from './SidebarLink/SidebarLink';
import { useTranslations } from 'next-intl';
import {Link} from '@/i18n/navigation';
import styles from './Sidebar.module.scss';

const drawerWidthOpen = 240;
const drawerWidthClosed = 70;
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
      } catch {
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
    <div className={styles.sideWrap}>
      {/* Toggle Button */}
      <button
        className={styles.collapseBtn}
        onClick={toggleDrawer}
        aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d={open ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'} />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={styles.side}
        style={{ width: open ? drawerWidthOpen : drawerWidthClosed }}
        aria-label="Навігація"
      >
        {/* Header */}
        <div className={styles.sideHead}>
          <div className={styles.logo}>
            <span className={styles.logoIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 3l10 4-6 6-4-10z" />
              </svg>
            </span>
            {open && <span className={styles.title}>{t('Admin')}</span>}
          </div>
          {open && (
            <span className={styles.badge} aria-label="Версія">
              v1.0
            </span>
          )}
        </div>

        {/* Navigation */}
        <div className={styles.sideSec}>
          <div className={styles.secTitle}>{open && 'Основне'}</div>
          <nav className={styles.navList}>
            <SidebarLink href="/admin/dashboard/" open={open}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              {open && (
              <span>{t('DashboardMain')}</span>
              )}
            </SidebarLink>

            <SidebarLink  href="/admin" open={open} count={6}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="7" height="7" />
                <rect x="14" y="4" width="7" height="7" />
                <rect x="14" y="15" width="7" height="7" />
                <rect x="3" y="15" width="7" height="7" />
              </svg>
              {open && (<span>{t('Clubs')}</span>
              )}
            </SidebarLink>

            <SidebarLink href="/admin/trainings" open={open} count={34}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
              {open && (<span>{t('Workout')}</span>)}
              
            </SidebarLink>
            <SidebarLink href="/admin/players" open={open} count={512}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zM3 22c0-3.9 4.5-7 9-7s9 3.1 9 7" />
              </svg>
              {open && (
                
              <span>{t('Players')}</span>
             
             
            )}
            </SidebarLink>
             {/* {effectiveClubId && (
             <>
             <SidebarLink href={`/admin/${effectiveClubId}/bookings/`} open={open} count={20}>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
               
               {open && (
                <>
              <span>Тренування</span>
              
              </>
            )}
               
             </SidebarLink>
             <SidebarLink href={`/admin/${effectiveClubId}/usersClub/`} open={open} count={100}>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zM3 22c0-3.9 4.5-7 9-7s9 3.1 9 7" />
              </svg>
           
               {open && (
                <>
              <span>Гравці</span>
              
              </>
            )}
            </SidebarLink>
             </>
           )} */}
           <SidebarLink  href="/admin/settings/" open={open} >
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 3.22 17l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 5.26 3.22l.06.06a1.65 1.65 0 0 0 1.82.33H7.15A1.65 1.65 0 0 0 8.66 2H8.75a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06A2 2 0 1 1 20.78 6l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c.69.18 1.19.8 1.19 1.53s-.5 1.35-1.19 1.53z"/>
          </svg>
              {open && (<span>{t('Settings')}</span>
              )}
            </SidebarLink>
            <SidebarLink  href="/admin/access-control/" open={open} >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="7" height="7" />
                <rect x="14" y="4" width="7" height="7" />
                <rect x="14" y="15" width="7" height="7" />
                <rect x="3" y="15" width="7" height="7" />
              </svg>
              {open && (<span>{t('AccessControl')}</span>
              )}
            </SidebarLink>
            <SidebarLink  href="/admin/messages/" open={open} count={115}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="7" height="7" />
                <rect x="14" y="4" width="7" height="7" />
                <rect x="14" y="15" width="7" height="7" />
                <rect x="3" y="15" width="7" height="7" />
              </svg>
            {open && (<span>{t('Messages')}</span>
              )}
            </SidebarLink>
            <SidebarLink  href="/admin/news/" open={open} count={7}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="7" height="7" />
                <rect x="14" y="4" width="7" height="7" />
                <rect x="14" y="15" width="7" height="7" />
                <rect x="3" y="15" width="7" height="7" />
              </svg>
              {open && (<span>{t('News')}</span>
              )}
            </SidebarLink>
            <SidebarLink  href="/admin/analytics/" open={open} >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M3 3h18v18H3z"/><path d="M7 13h3v6H7zM12 5h3v14h-3zM17 10h3v9h-3z"/>
          </svg>
              {open && (<span>{t('Analytics')}</span>
              )}
            </SidebarLink>
        <SidebarLink  href="/admin/logs/" open={open} >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="7" height="7" />
                <rect x="14" y="4" width="7" height="7" />
                <rect x="14" y="15" width="7" height="7" />
                <rect x="3" y="15" width="7" height="7" />
              </svg>
              {open && (<span>{t('Log')}</span>
              )}
            </SidebarLink>
           
            {/* <SidebarLink href="/admin/settings/" open={open}>
//                 {open ? t('Settings') : '⚙️'}
//               </SidebarLink>

//               <SidebarLink href="/admin/users/" open={open}>
//                 {open ? t('Players') : '👤'}
//               </SidebarLink>

//               {effectiveClubId && (
//                 <div className="px-4">
//                   <SidebarLink href={`/admin/${effectiveClubId}/bookings/`} open={open}>
//                     {open ? t('Bookings') : '🏟️'}
//                   </SidebarLink>
//                   <SidebarLink href={`/admin/${effectiveClubId}/usersClub/`} open={open}>
//                     {open ? t('UsersClub') : '👥🎾'}
//                   </SidebarLink>
//                 </div>
//               )}

//               <SidebarLink href="/admin/access-control/" open={open}>
//                 {open ? t('AccessControl') : '🔐'}
//               </SidebarLink>
//               <SidebarLink href="/admin/messages/" open={open}>
//                 {open ? t('Messages') : '💬'}
//               </SidebarLink>
//               <SidebarLink href="/admin/news/" open={open}>
//                 {open ? t('News') : '📰'}
//               </SidebarLink>
//               <SidebarLink href="/admin/analytics/" open={open}>
//                 {open ? t('Analytics') : '📊'}
//               </SidebarLink>
//               <SidebarLink href="/admin/logs/" open={open}>
//                 {open ? t('Log') : '📜'}
//               </SidebarLink>

//               {/* <SidebarLink href="/admin/add-club/" open={open}>
//                 {open ? 'Add Club' : '🏸➕'}
//               </SidebarLink> */} 
          </nav>
        </div>


{/* //===============================  start  ==============================================// */}

        {/* Users group */}
        {/* <details className={styles.group} open>
          <summary>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11zM8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11z" />
            </svg>
            {open &&
            (<span>Користувачі</span>)
            }
          </summary>
          <div className={`${styles.inner} ${styles.navList}`}>
            <SidebarLink href="/admin/players" open={open} count={512}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zM3 22c0-3.9 4.5-7 9-7s9 3.1 9 7" />
              </svg>
              {open && (
                <>
              <span>Гравці</span>
             
              </>
            )}
            </SidebarLink>

            <SidebarLink href="/admin/managers" open={open} count={12}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {open && (<span>Менеджери</span>)}
              
            </SidebarLink>
          </div>
        </details> */}


  {/* //=========================  end  ===============================//       */}






        {/* Footer */}
        {open && (
          <div className={styles.sideFoot}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 20l9-16H3l9 16z" />
            </svg>
            <span>Документація</span>
          </div>
        )}
      </aside>
    </div>
  );
}
