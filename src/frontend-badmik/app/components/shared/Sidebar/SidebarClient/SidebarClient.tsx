// app/components/shared/Sidebar/SidebarClient.tsx  ← CLIENT component
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import SidebarLink from "./SidebarLink/SidebarLink";
import styles from "./Sidebar.module.scss";

type Props = {
  role?: string;
  userId?: string;
  email?: string;
};

const drawerWidthOpen = 240;
const drawerWidthClosed = 70;

export default function SidebarClient({ role, userId, email }: Props) {
  const [open, setOpen] = useState(true);
  const params = useParams();
  const t = useTranslations("Sidebar");

  // якщо немає ролі — взагалі не рендеримо
  if (!role) return null;

  const toggleDrawer = () => setOpen((v) => !v);

  // якщо у вас clubId у роуті /admin/[clubId]/..., витягуємо його з params
  const clubIdFromRoute =
    typeof params.clubId === "string" ? params.clubId : undefined;

  // якщо адмiн — можете брати clubId з токена (передати з сервера, коли з’явиться),
  // або використовувати той, що в роуті — залежно від вашої бізнес-логіки
  const effectiveClubId = clubIdFromRoute;

  return (
    <aside
      className={styles.sideWrap}
      style={{ width: open ? drawerWidthOpen : drawerWidthClosed }}
    >
       <button
        className={styles.collapseBtn}
        onClick={toggleDrawer}
        aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d={open ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'} />
        </svg>
      </button>

      <nav className={styles.side}
        style={{ width: open ? drawerWidthOpen : drawerWidthClosed }}
        aria-label="Навігація" >
        {/* приклади; додай свої пункти */}
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
           
     
          </nav>
        </div>









        {/* Footer */}
        {open && (
          <div className={styles.sideFoot}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 20l9-16H3l9 16z" />
            </svg>
            <span>Документація</span>
          </div>
        )}
      </nav>
    </aside>
  );
}
