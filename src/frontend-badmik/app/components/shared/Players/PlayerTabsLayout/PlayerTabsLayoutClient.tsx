// src/app/components/shared/Players/PlayerTabsLayout/PlayerTabsLayoutClient.tsx
'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import styles from './PlayerTabsLayoutClient.module.scss';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';

import { Link } from '@/i18n/navigation';

import { usePlayerById } from '@/services/players/queries.client';
import { useClubById } from '@/services/clubs/queries.client';

// ✅ ВАЖЛИВО: імпорт тільки через alias (той самий модуль що і Provider)
import { usePlayerTabsHeaderAction } from '@/app/components/shared/Players/PlayerTabsLayout/PlayerTabsHeaderActionContext';

type Props = {
  clubId: string;
  playerId: string;
  children: ReactNode;
};

const DASH = '—';

function fullName(p: any) {
  const u = p?.user ?? null;
  const fn = String(u?.firstName ?? '').trim();
  const ln = String(u?.lastName ?? '').trim();
  const fromParts = `${fn}${fn && ln ? ' ' : ''}${ln}`.trim();
  return fromParts || String(u?.fullName ?? '').trim() || 'Player';
}

export default function PlayerTabsLayoutClient({ clubId, playerId, children }: Props) {
  const tPB = useTranslations('playersBreadcrumbs');
  const tTabs = useTranslations('PlayerDetails.tabs');

  const pathname = usePathname();

  const { headerAction } = usePlayerTabsHeaderAction();

  const qPlayer = usePlayerById(playerId, {
    enabled: Boolean(playerId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const player = qPlayer.data ?? null;

  const qClub = useClubById(clubId, {
    enabled: Boolean(clubId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const busy = qPlayer.isLoading || qPlayer.isFetching || qClub.isLoading || qClub.isFetching;

  const base = `/admin/${clubId}/players/${playerId}`;

  const tabs = useMemo(
    () => [
      { key: 'info', label: tTabs('info'), href: base },
      { key: 'subscriptions', label: tTabs('subscriptions'), href: `${base}/player-memberships` },
      { key: 'trainings', label: tTabs('trainings'), href: `${base}/trainings` },
      { key: 'followers', label: tTabs('followers'), href: `${base}/followers` },
      { key: 'following', label: tTabs('following'), href: `${base}/following` },
      { key: 'favoriteLocations', label: tTabs('favoriteLocations'), href: `${base}/favorite-locations` },
    ],
    [base, tTabs],
  );

  const activeKey = useMemo(() => {
    if (pathname?.includes('/player-memberships')) return 'subscriptions';
    if (pathname?.includes('/trainings')) return 'trainings';
    if (pathname?.includes('/followers')) return 'followers';
    if (pathname?.includes('/following')) return 'following';
    if (pathname?.includes('/favorite-locations')) return 'favoriteLocations';
    return 'info';
  }, [pathname]);

  const editHref = player?.id ? `/admin/${clubId}/players/${player.id}/edit-player` : '#';
  const playersHref = `/admin/${clubId}/players`;
  const headerTitle = player ? fullName(player) : DASH;

  return (
    <section className={styles.wrapper}>
      <div className="p-0 p-3">
        <ActionHeader>
          <BackButton label="buttons.back" />
          <div className={styles.headerTitle}>{headerTitle}</div>

          {/* ✅ правий екшен приходить з активної таби */}
          {headerAction ?? (activeKey === 'info' ? <EditButton href={editHref} label="buttons.update" /> : <div />)}
        </ActionHeader>
      </div>

      <div className={styles.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: tPB('Admin'), href: `/admin/${clubId}/dashboard` },
            { label: tPB('Players'), href: playersHref },
            { label: player ? fullName(player) : DASH },
          ]}
        />
      </div>

      <div className={styles.tabsBar}>
        {tabs.map((tab) => {
          const active = tab.key === activeKey;
          return (
            <Link key={tab.key} href={tab.href} className={`${styles.tab} ${active ? styles.tabActive : ''}`}>
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


