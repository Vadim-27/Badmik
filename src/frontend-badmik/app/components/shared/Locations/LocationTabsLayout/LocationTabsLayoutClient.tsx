'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import styles from './LocationTabsLayoutClient.module.scss';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';

import { Link } from '@/i18n/navigation';

import { useClubById } from '@/services/clubs/queries.client';
// ⬇️ тут має бути ваш існуючий locations query
import { useLocationById } from '@/services/locations/queries.client';

import { useLocationTabsHeaderAction } from './LocationTabsHeaderActionContext';

type Props = {
  clubId: string;
  locationId: string;
  children: ReactNode;
};

const DASH = '—';

function locationTitle(loc: any) {
  return String(loc?.name ?? loc?.title ?? '').trim() || 'Location';
}

export default function LocationTabsLayoutClient({ clubId, locationId, children }: Props) {
  const tBC = useTranslations('locationsBreadcrumbs');
  const tTabs = useTranslations('locationDetails.tabs');

  const pathname = usePathname();
  const { headerAction } = useLocationTabsHeaderAction();

  const qLocation = useLocationById(locationId, {
    enabled: Boolean(locationId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const qClub = useClubById(clubId, {
    enabled: Boolean(clubId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const busy = qLocation.isLoading || qLocation.isFetching || qClub.isLoading || qClub.isFetching;

  const base = `/admin/${clubId}/locations/${locationId}`;

  const tabs = useMemo(
    () => [
      { key: 'info', label: tTabs('info'), href: `${base}/info-location` },
      { key: 'images', label: tTabs('images'), href: `${base}/images` },
      { key: 'training-schedules', label: tTabs('trainings'), href: `${base}/training-schedules` },
    ],
    [base, tTabs],
  );

  const activeKey = useMemo(() => {
  const p = pathname ?? '';

  if (p.includes('/training-schedules')) return 'training-schedules';
  if (p.includes('/images')) return 'images';
  if (p.includes('/info-location')) return 'info';

  // fallback: якщо ми на /locations/:id (без підшляху) — хай буде info
  return 'info';
}, [pathname]);

  const location = qLocation.data ?? null;
  const headerTitle = location ? locationTitle(location) : DASH;

  const editHref = location?.id ? `${base}/edit` : '#';
  const locationsHref = `/admin/${clubId}/locations`;

  // дефолтні кнопки (як у Player)
  const defaultAction =
    activeKey === 'info' ? (
      <EditButton href={editHref} label="buttons.update" />
    ) : (
      // на images дефолтно показуємо upload, але в ідеалі це буде headerAction з Images tab
    //   <button label="buttons.uploadImages" onClick={() => {}} />
      <button type="button" onClick={() => {}}>
  Upload
</button>
    );

  return (
    <section className={styles.wrapper}>
      <div className="p-0 p-3">
        <ActionHeader>
          <BackButton label="buttons.back" />
          <div className={styles.headerTitle}>{headerTitle}</div>

          {headerAction ?? defaultAction}
        </ActionHeader>
      </div>

      <div className={styles.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: tBC('Admin'), href: `/admin/${clubId}/dashboard` },
            { label: tBC('Locations'), href: locationsHref },
            { label: location ? locationTitle(location) : DASH },
          ]}
        />
      </div>

      <div className={styles.tabsBar}>
        {tabs.map((tab) => {
          const active = tab.key === activeKey;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`${styles.tab} ${active ? styles.tabActive : ''}`}
            >
              <span className={styles.tabLabel}>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      <div className={styles.tabContent}>
        {busy ? <SpinnerOverlay fullscreen={false} /> : null}
        {children}
      </div>
    </section>
  );
}
