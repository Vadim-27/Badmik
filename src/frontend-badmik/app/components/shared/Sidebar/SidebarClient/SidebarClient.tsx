// // app/components/shared/Sidebar/SidebarClient.tsx  ← CLIENT component
// 'use client';

// import { useState } from 'react';
// import { useParams } from 'next/navigation';
// import { useTranslations } from 'next-intl';
// import SidebarLink from './SidebarLink/SidebarLink';
// import styles from './Sidebar.module.scss';

// import { useRouter } from 'next/navigation';
// import { useLocationsListByClub } from '@/services/locations/queries.client';
// import type { Location } from '@/services/types/locations.dto';

// //====

// import { useClubScope } from '@/lib/club-scope';

// //====

// type Props = {
//   role?: string;
//   userId?: string;
//   email?: string;
//   isAdmin?: boolean;
//   clubId?: string;
// };

// const drawerWidthOpen = 240;
// const drawerWidthClosed = 70;

// export default function SidebarClient({ role, userId, email, isAdmin, clubId }: Props) {
//   const clubIdByToken = !isAdmin ? clubId : undefined;
//   // const clubLink = (!isAdmin && clubIdByToken) ? `` : 'clubs';
//   const [open, setOpen] = useState(true);
//   const params = useParams();
//   const t = useTranslations('Sidebar');

//   // const { buildHref } = useClubScope();

//   // Локальний buildHref, більше не юзаємо useClubScope
//   const buildHref = (path: string) => {
//     const clean = path.startsWith('/') ? path.slice(1) : path;
//     const base = '/admin';

//     // Якщо це клубний персонал і є clubId в токені →
//     // будуємо /admin/:clubId/...
//     if (clubIdByToken) {
//       return `${base}/${clubIdByToken}/${clean}`.replace(/\/+$/, '/');
//     }

//     // Якщо супер-адмін → глобальні шляхи /admin/...
//     return `${base}/${clean}`.replace(/\/+$/, '/');
//   };

//   // далі все як було, просто всі href через buildHref(...)

//   // якщо немає ролі — взагалі не рендеримо
//   // if (!role) return null;

//   const toggleDrawer = () => setOpen((v) => !v);

//   // якщо у вас clubId у роуті /admin/[clubId]/..., витягуємо його з params
//   // const clubIdFromRoute =
//   //   typeof params.clubId === "string" ? params.clubId : undefined;

//   // // якщо адмiн — можете брати clubId з токена (передати з сервера, коли з’явиться),
//   // // або використовувати той, що в роуті — залежно від вашої бізнес-логіки
//   // const effectiveClubId = clubIdFromRoute;
//   // console.log(" effectiveClubId:", effectiveClubId);

//   return (
//     <aside
//       className={styles.sideWrap}
//       style={{ width: open ? drawerWidthOpen : drawerWidthClosed }}
//     >
//       <button
//         className={styles.collapseBtn}
//         onClick={toggleDrawer}
//         aria-label={open ? t('aria.closeMenu') : t('aria.openMenu')}
//       >
//         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//           <path d={open ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'} />
//         </svg>
//       </button>

//       <nav
//         className={styles.side}
//         style={{ width: open ? drawerWidthOpen : drawerWidthClosed }}
//         aria-label={t('aria.navigation')}
//       >
//         {/* приклади; додай свої пункти */}
//         <div className={styles.sideHead}>
//           <div className={styles.logo}>
//             <span className={styles.logoIcon} aria-hidden="true">
//               <svg viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M7 3l10 4-6 6-4-10z" />
//               </svg>
//             </span>
//             {open && <span className={styles.title}>{t('Admin')}</span>}
//           </div>
//           {open && (
//             <span className={styles.badge} aria-label="Версія">
//               v1.0
//             </span>
//           )}
//         </div>

//         {/* Navigation */}
//         <div className={styles.sideSec}>
//           <div className={styles.secTitle}>{open && t('sections.main')}</div>
//           <nav className={styles.navList}>
//             <SidebarLink
//               href={buildHref('dashboard')}
//               // href="/admin/dashboard/"
//               open={open}
//             >
//               <svg
//                 aria-hidden="true"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path d="M3 12h18M3 6h18M3 18h18" />
//               </svg>
//               {open && <span>{t('DashboardMain')}</span>}
//             </SidebarLink>

//             {isAdmin && (
//               <SidebarLink href={buildHref('clubs')} open={open} count={6}>
//                 <svg
//                   aria-hidden="true"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <rect x="3" y="4" width="7" height="7" />
//                   <rect x="14" y="4" width="7" height="7" />
//                   <rect x="14" y="15" width="7" height="7" />
//                   <rect x="3" y="15" width="7" height="7" />
//                 </svg>
//                 {open && <span>{t('Clubs')}</span>}
//               </SidebarLink>
//             )}

          
              
          

//             {/* <SidebarLink  href={buildHref(`${clubLink}`)} open={open} count={6}>
//               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                 <rect x="3" y="4" width="7" height="7" />
//                 <rect x="14" y="4" width="7" height="7" />
//                 <rect x="14" y="15" width="7" height="7" />
//                 <rect x="3" y="15" width="7" height="7" />
//               </svg>
//               {open && (<span>{t('Clubs')}</span>
//               )}
//             </SidebarLink> */}
//             {!isAdmin && clubIdByToken && (
//               <SidebarLink href={buildHref('')} open={open} exact>
//                 <svg
//                   aria-hidden="true"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//                 {open && <span>{t('Clubs')}</span>}
//               </SidebarLink>
//             )}

//             <SidebarLink href={buildHref('club-settings')} open={open} count={6}>
//                 <svg
//                   aria-hidden="true"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <rect x="3" y="4" width="7" height="7" />
//                   <rect x="14" y="4" width="7" height="7" />
//                   <rect x="14" y="15" width="7" height="7" />
//                   <rect x="3" y="15" width="7" height="7" />
//                 </svg>
//                 {open && <span>{t('ClubSettings')}</span>}
//               </SidebarLink>

              
//             <SidebarLink href={buildHref(`locations`)} open={open} count={6}>
//               <svg
//                 aria-hidden="true"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <rect x="3" y="4" width="7" height="7" />
//                 <rect x="14" y="4" width="7" height="7" />
//                 <rect x="14" y="15" width="7" height="7" />
//                 <rect x="3" y="15" width="7" height="7" />
//               </svg>
//               {open && <span>{t('Locations')}</span>}
//             </SidebarLink>

//             <SidebarLink href={buildHref(`club-memberships`)} open={open} count={6}>
//               <svg
//                 aria-hidden="true"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <rect x="3" y="4" width="7" height="7" />
//                 <rect x="14" y="4" width="7" height="7" />
//                 <rect x="14" y="15" width="7" height="7" />
//                 <rect x="3" y="15" width="7" height="7" />
//               </svg>
//               {open && <span>{t('ClubMembershipPlans')}</span>}
//             </SidebarLink>

//             {effectiveClubId && (
//   <>
//     {(() => {
//       const list = clubLocations ?? [];

//       // 1) якщо 1 локація — одразу прямий лінк
//       if (list.length === 1) {
//         const locId = list[0].id;

//         return (
//           <SidebarLink
//             href={buildClubHref(`locations/${locId}/training-schedules`)}
//             open={open}
//           >
//             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//               <path d="M4 7h16M4 12h16M4 17h16" />
//             </svg>
//             {open && <span>{t('TrainingSchedules')}</span>}
//           </SidebarLink>
//         );
//       }

//       // 2) якщо 0 або >1 — показуємо групу
//       return (
//         <div className={styles.navGroup}>
//           {/* ГОЛОВНИЙ рядок — вигляд як link, але це toggle (не навігація) */}
//           <button
//             type="button"
//             className={styles.navGroupHead}
//             onClick={onToggleTrainingSchedules}
//             onMouseEnter={() => {
//               // легкий prefetch при hover
//               void prefetchLocations();
//             }}
//             aria-expanded={tsOpen}
//           >
//             <span className={styles.navGroupIcon} aria-hidden="true">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                 <path d="M4 7h16M4 12h16M4 17h16" />
//               </svg>
//             </span>

//             {open && (
//               <>
//                 <span className={styles.navGroupTitle}>{t('TrainingSchedules')}</span>

//                 <span className={styles.navGroupRight}>
//                   {isFetchingLocations ? (
//                     <span className={styles.navGroupSpinner} aria-label={t('aria.loading')} />
//                   ) : (
//                     <svg
//                       className={styles.navGroupChevron}
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth={2}
//                       aria-hidden="true"
//                     >
//                       <path d={tsOpen ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} />
//                     </svg>
//                   )}
//                 </span>
//               </>
//             )}
//           </button>

//           {/* submenu = ЛІНКИ */}
//           {open && tsOpen && list.length > 1 && (
//             <div className={styles.navGroupMenu}>
//               {list.map((loc) => (
//                 <SidebarLink
//                   key={loc.id}
//                   href={buildClubHref(`locations/${loc.id}/training-schedules`)}
//                   open={true} // submenu завжди "open" для показу тексту
//                   exact={false}
//                 >
//                   <span className={styles.subDot} aria-hidden="true" />
//                   <span>{loc.name ?? loc.id}</span>
//                 </SidebarLink>
//               ))}
//             </div>
//           )}
//         </div>
//       );
//     })()}
//   </>
// )}

//             {/* <SidebarLink 
//             href={buildHref('trainings')} 
//             // href="/admin/trainings" 
//             open={open} count={34}>
//               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                 <path d="M3 7h18M3 12h18M3 17h18" />
//               </svg>
//               {open && (<span>{t('Workout')}</span>)}
              
//             </SidebarLink> */}
//             <SidebarLink
//               // href="/admin/players"
//               href={buildHref('players')}
//               open={open}
//               count={512}
//             >
//               <svg
//                 aria-hidden="true"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zM3 22c0-3.9 4.5-7 9-7s9 3.1 9 7" />
//               </svg>
//               {open && <span>{t('Players')}</span>}
//             </SidebarLink>

//             {/* <SidebarLink  href="/admin/settings/" open={open} >
//              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//             <circle cx="12" cy="12" r="3"/>
//             <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 3.22 17l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 5.26 3.22l.06.06a1.65 1.65 0 0 0 1.82.33H7.15A1.65 1.65 0 0 0 8.66 2H8.75a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06A2 2 0 1 1 20.78 6l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c.69.18 1.19.8 1.19 1.53s-.5 1.35-1.19 1.53z"/>
//           </svg>
//               {open && (<span>{t('Settings')}</span>
//               )}
//             </SidebarLink> */}
//             <SidebarLink
//               // href="/admin/access-control/"
//               href={buildHref('staff')}
//               open={open}
//             >
//               <svg
//                 aria-hidden="true"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <rect x="3" y="4" width="7" height="7" />
//                 <rect x="14" y="4" width="7" height="7" />
//                 <rect x="14" y="15" width="7" height="7" />
//                 <rect x="3" y="15" width="7" height="7" />
//               </svg>
//               {open && <span>{t('Staff')}</span>}
//             </SidebarLink>
//             {/* <SidebarLink  href="/admin/messages/" open={open} count={115}>
//               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                 <rect x="3" y="4" width="7" height="7" />
//                 <rect x="14" y="4" width="7" height="7" />
//                 <rect x="14" y="15" width="7" height="7" />
//                 <rect x="3" y="15" width="7" height="7" />
//               </svg>
//             {open && (<span>{t('Messages')}</span>
//               )}
//             </SidebarLink> */}
//             {/* <SidebarLink  href="/admin/news/" open={open} count={7}>
//               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                 <rect x="3" y="4" width="7" height="7" />
//                 <rect x="14" y="4" width="7" height="7" />
//                 <rect x="14" y="15" width="7" height="7" />
//                 <rect x="3" y="15" width="7" height="7" />
//               </svg>
//               {open && (<span>{t('News')}</span>
//               )}
//             </SidebarLink> */}
//             {/* <SidebarLink  href="/admin/analytics/" open={open} >
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//             <path d="M3 3h18v18H3z"/><path d="M7 13h3v6H7zM12 5h3v14h-3zM17 10h3v9h-3z"/>
//           </svg>
//               {open && (<span>{t('Analytics')}</span>
//               )}
//             </SidebarLink> */}
//             {/* <SidebarLink  href="/admin/logs/" open={open} >
//               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                 <rect x="3" y="4" width="7" height="7" />
//                 <rect x="14" y="4" width="7" height="7" />
//                 <rect x="14" y="15" width="7" height="7" />
//                 <rect x="3" y="15" width="7" height="7" />
//               </svg>
//               {open && (<span>{t('Log')}</span>
//               )}
//             </SidebarLink>
//             */}
//           </nav>
//         </div>

//         {/* Footer */}
//         {/* {open && (
//           <div className={styles.sideFoot}>
//             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//               <path d="M12 20l9-16H3l9 16z" />
//             </svg>
//             <span>Документація</span>
//           </div>
//         )} */}
//       </nav>
//     </aside>
//   );
// }



//================================


// app/components/shared/Sidebar/SidebarClient/SidebarClient.tsx
'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import SidebarLink from './SidebarLink/SidebarLink';
import styles from './Sidebar.module.scss';

import { useLocationsListByClub } from '@/services/locations/queries.client';
import TrainingSchedulesIcon from '@/app/assets/icons/TrainingSchedulesBurger.svg';
import ChevronDownIcon from '@/app/assets/icons/ChevronDown.svg';

type Props = {
  role?: string;
  userId?: string;
  email?: string;
  isAdmin?: boolean;
  clubId?: string;
};

const drawerWidthOpen = 240;
const drawerWidthClosed = 70;

export default function SidebarClient({ role, userId, email, isAdmin, clubId }: Props) {
  const [open, setOpen] = useState(true);
  const [tsOpen, setTsOpen] = useState(false);

  const params = useParams();
  const t = useTranslations('Sidebar');

  // staff: clubId з токена, admin: clubId з URL
  const clubIdByToken = !isAdmin ? clubId : undefined;

  const clubIdFromRoute =
    typeof (params as any)?.clubId === 'string' ? String((params as any).clubId) : undefined;

  const effectiveClubId = clubIdByToken ?? clubIdFromRoute;

  // Локальний buildHref (як у вас було)
  const buildHref = (path: string) => {
    const clean = path.startsWith('/') ? path.slice(1) : path;
    const base = '/admin';

    if (clubIdByToken) {
      return `${base}/${clubIdByToken}/${clean}`.replace(/\/+$/, '/');
    }

    return `${base}/${clean}`.replace(/\/+$/, '/');
  };

  // Для URL, які залежать від clubId з роуту або з токена
  const buildClubHref = (path: string) => {
    const clean = path.startsWith('/') ? path.slice(1) : path;
    const base = '/admin';

    if (effectiveClubId) {
      return `${base}/${effectiveClubId}/${clean}`.replace(/\/+$/, '/');
    }

    return `${base}/${clean}`.replace(/\/+$/, '/');
  };

  const toggleDrawer = () => setOpen((v) => !v);

  // ✅ Беремо локації зі "стору" (React Query cache з RQHydrate в Sidebar.tsx)
  // Для admin в контексті клубу — підвантажиться клієнтом.
  const { data: clubLocations = [], isFetching: isFetchingLocations } =
    useLocationsListByClub(effectiveClubId ?? '', {
      enabled: !!effectiveClubId,
    });

  const hasManyLocations = clubLocations.length > 1;

  const onToggleTrainingSchedules = () => {
    if (!hasManyLocations) return;
    setTsOpen((v) => !v);
  };

  // якщо немає ролі — можете сховати, як у вас було
  // if (!role) return null;

  return (
    <aside
      className={styles.sideWrap}
      style={{ width: open ? drawerWidthOpen : drawerWidthClosed }}
    >
      <button
        className={styles.collapseBtn}
        onClick={toggleDrawer}
        aria-label={open ? t('aria.closeMenu') : t('aria.openMenu')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d={open ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'} />
        </svg>
      </button>

      <nav
        className={styles.side}
        style={{ width: open ? drawerWidthOpen : drawerWidthClosed }}
        aria-label={t('aria.navigation')}
      >
        {/* Head */}
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
          <div className={styles.secTitle}>{open && t('sections.main')}</div>

          <nav className={styles.navList}>
            <SidebarLink href={buildHref('dashboard')} open={open}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              {open && <span>{t('DashboardMain')}</span>}
            </SidebarLink>

            {isAdmin && (
              <SidebarLink href={buildHref('clubs')} open={open} count={6}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="7" height="7" />
                  <rect x="14" y="4" width="7" height="7" />
                  <rect x="14" y="15" width="7" height="7" />
                  <rect x="3" y="15" width="7" height="7" />
                </svg>
                {open && <span>{t('Clubs')}</span>}
              </SidebarLink>
            )}

            {!isAdmin && clubIdByToken && (
              <SidebarLink href={buildHref('')} open={open} exact>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {open && <span>{t('Clubs')}</span>}
              </SidebarLink>
            )}

            <SidebarLink href={buildHref('club-settings')} open={open} count={6}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="7" height="7" />
                <rect x="14" y="4" width="7" height="7" />
                <rect x="14" y="15" width="7" height="7" />
                <rect x="3" y="15" width="7" height="7" />
              </svg>
              {open && <span>{t('ClubSettings')}</span>}
            </SidebarLink>

            <SidebarLink href={buildHref('locations')} open={open} count={6}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="7" height="7" />
                <rect x="14" y="4" width="7" height="7" />
                <rect x="14" y="15" width="7" height="7" />
                <rect x="3" y="15" width="7" height="7" />
              </svg>
              {open && <span>{t('Locations')}</span>}
            </SidebarLink>

            <SidebarLink href={buildHref('club-memberships')} open={open} count={6}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="7" height="7" />
                <rect x="14" y="4" width="7" height="7" />
                <rect x="14" y="15" width="7" height="7" />
                <rect x="3" y="15" width="7" height="7" />
              </svg>
              {open && <span>{t('ClubMembershipPlans')}</span>}
            </SidebarLink>

            {/* ✅ Training schedules (club-level entry point -> location-level pages) */}
            {effectiveClubId && (
              <>
                {/* 1 location -> direct link */}
                {clubLocations.length === 1 && (
                  <SidebarLink
                    href={buildClubHref(`locations/${clubLocations[0].id}/training-schedules`)}
                    open={open}
                  >
                    <span className={styles.navGroupIcon} aria-hidden="true">
  <TrainingSchedulesIcon className={styles.icon} />
</span>
                    {open && <span>{t('TrainingSchedules')}</span>}
                  </SidebarLink>
                )}

                {/* many locations -> toggle + mapped links */}
                {clubLocations.length > 1 && (
                  <div className={styles.navGroup}>
                    <button
                      type="button"
                      className={styles.navGroupHead}
                      onClick={onToggleTrainingSchedules}
                      aria-expanded={tsOpen}
                    >
                      <span className={styles.navGroupIcon} aria-hidden="true">
  <TrainingSchedulesIcon className={styles.icon} />
</span>

                      {open && (
                        <>
                          <span className={styles.navGroupTitle}>{t('TrainingSchedules')}</span>

                          <span className={styles.navGroupRight}>
                            {isFetchingLocations ? (
                              <span className={styles.navGroupSpinner} aria-label={t('aria.loading')} />
                            ) : (
                              <ChevronDownIcon
  className={`${styles.navGroupChevron} ${tsOpen ? styles.rotated : ''}`}
/>
                            )}
                          </span>
                        </>
                      )}
                    </button>

                    {open && tsOpen && (
                      <div className={styles.navGroupMenu}>
                        {clubLocations.map((loc) => (
                          <SidebarLink
                            key={loc.id}
                            href={buildClubHref(`locations/${loc.id}/training-schedules`)}
                            open={true}
                          >
                            {/* <span className={styles.subDot} aria-hidden="true" /> */}
                            <span>{loc.name ?? loc.id}</span>
                          </SidebarLink>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            <SidebarLink href={buildHref('players')} open={open} count={512}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zM3 22c0-3.9 4.5-7 9-7s9 3.1 9 7" />
              </svg>
              {open && <span>{t('Players')}</span>}
            </SidebarLink>

            <SidebarLink href={buildHref('staff')} open={open}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="7" height="7" />
                <rect x="14" y="4" width="7" height="7" />
                <rect x="14" y="15" width="7" height="7" />
                <rect x="3" y="15" width="7" height="7" />
              </svg>
              {open && <span>{t('Staff')}</span>}
            </SidebarLink>
          </nav>
        </div>
      </nav>
    </aside>
  );
}