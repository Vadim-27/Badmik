'use client';

import React, { useMemo } from 'react';
import styles from './PlayerDetails.module.scss';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
import SafeDate from '@/app/components/ui/SafeDate/SafeDate';
import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';

import { usePlayerById } from '@/services/players/queries.client';
import type { Player } from '@/services/types/players.dto';

import { useTranslations } from 'next-intl';

// ✅ 1) ДОДАЙ хук для клубу (назва може відрізнятись у вас)
import { useClubById } from '@/services/clubs/queries.client';
import { Link } from '@/i18n/navigation';
import { buildHrefServer } from '@/lib/club-scope.server';
// або: import { useClubById } from '@/services/clubs/queries.client';

type Props = {
  playerId: string;
  clubIdParams?: string;
};

const DASH = '—';

const displayOrDash = (v: unknown): string => {
  const s = String(v ?? '').trim();
  return s ? s : DASH;
};

function fullName(p?: Player | null) {
  const u = p?.user ?? null;

  const fn = String(u?.firstName ?? '').trim();
  const ln = String(u?.lastName ?? '').trim();
  const fromParts = `${fn}${fn && ln ? ' ' : ''}${ln}`.trim();

  return fromParts || String((u as any)?.fullName ?? '').trim() || 'Player';
}

export default function PlayerDetail({ playerId, clubIdParams }: Props) {
  const tPF = useTranslations('PlayerForm');
  const tPB = useTranslations('playersBreadcrumbs');
  const tPD = useTranslations('PlayerDetails');
  const tGender = useTranslations('PlayerCard.genderType');

  const q = usePlayerById(playerId, {
    enabled: Boolean(playerId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const player = q.data ?? null;

  const clubId = String(player?.clubId ?? '');

  const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? 'https://staging.api.badmik.com.ua';
  const playerPhotoUrlRaw = (player as any)?.photoUrl ?? '';
  const playerPhotoUrl =
    playerPhotoUrlRaw && playerPhotoUrlRaw.startsWith('http')
      ? playerPhotoUrlRaw
      : playerPhotoUrlRaw
        ? `${API_ORIGIN}${playerPhotoUrlRaw}`
        : '';

  //=====================

  const tTabs = useTranslations('PlayerDetails.tabs');

  // тут поки статичні лінки (як у стафі/гравці), потім підв’яжеш реальні counts
  const tabs = [
    { key: 'info', label: tTabs('info'), href: `/admin/players/${playerId}` },
    {
      key: 'subscriptions',
      label: tTabs('subscriptions'),
      href: `/admin/${clubId}/players/${playerId}/player-memberships`,
      count: 2,
    },
    {
      key: 'trainings',
      label: tTabs('trainings'),
      href: `/admin/players/${playerId}/trainings`,
      count: 5,
    },
    {
      key: 'followers',
      label: tTabs('followers'),
      href: `/admin/players/${playerId}/followers`,
      count: 18,
    },
    {
      key: 'following',
      label: tTabs('following'),
      href: `/admin/players/${playerId}/following`,
      count: 9,
    },
    {
      key: 'favoriteLocations',
      label: tTabs('favoriteLocations'),
      href: `/admin/players/${playerId}/favorite-locations`,
      count: 3,
    },
  ];

  // на цій сторінці активний таб — “info”
  const activeKey = 'info' as const;

  //=====================
  // ✅ 2) ТЯГНЕМО КЛУБ ПО ID
  const clubQ = useClubById(clubId, {
    enabled: Boolean(clubId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const clubName = (clubQ.data as any)?.name ?? (clubQ.data as any)?.title ?? ''; // підстраховка, якщо поле називається не "name"

  const busy =
    q.isLoading || q.isFetching || (Boolean(clubId) && (clubQ.isLoading || clubQ.isFetching));

  const editHref = clubId && player?.id ? `/admin/${clubId}/players/${player.id}/edit-player` : '#';

  const sportsChips = useMemo(() => {
    const list = (player?.sportProfiles ?? [])
      .filter((sp) => sp?.sport)
      .map((sp) => ({
        sport: String(sp!.sport),
        level: String(sp?.level ?? 'D'),
      }));

    const map = new Map<string, { sport: string; level: string }>();
    for (const item of list) {
      if (!map.has(item.sport)) map.set(item.sport, item);
    }

    return Array.from(map.values());
  }, [player?.sportProfiles]);

  const headerTitle = fullName(player);

  const playersHref = buildHrefServer(clubIdParams, `players`);

  return (
    <section className={styles.wrapper}>
      {/* <ActionHeader>
        <BackButton label="buttons.back" />
        <div className="text-lg font-semibold">
          <h1 className={styles.title}>{headerTitle}</h1>
        </div>
        <EditButton href={editHref} label="buttons.update" />
      </ActionHeader>

      <div className={styles.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: tPB('Admin'), href: '/admin/dashboard' },
            { label: tPB('Players'), href: playersHref },
            { label: fullName(player) },
          ]}
        />
      </div> */}

      {/* <div className={styles.tabsBar}>
        {tabs.map((tab) => {
          const active = tab.key === activeKey;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`${styles.tab} ${active ? styles.tabActive : ''}`}
            >
              <span className={styles.tabLabel}>{tab.label}</span>

              {typeof tab.count === 'number' && <span className={styles.badge}>{tab.count}</span>}
            </Link>
          );
        })}
      </div> */}

      <div className={styles.card}>
        {busy && <SpinnerOverlay fullscreen={false} />}

        {!busy && !player && (
          <div className={styles.row}>
            <div className={styles.label}>{tPD('error')}</div>
            <div className={styles.value}>{tPD('error')}</div>
          </div>
        )}

        {player && (
          <>
            {/* Avatar + Full name */}
            <div className={styles.row}>
              {/* <div className={styles.label}>{tPF('fields.firstName')}</div> */}
              <div className={styles.avatarBox}>
                {playerPhotoUrl ? (
                  <img src={playerPhotoUrl} alt={fullName(player)} className={styles.avatarImg} />
                ) : (
                  <span className={styles.avatarPlaceholder}>—</span>
                )}
              </div>

              <div className={styles.value}>
                <div className={styles.playerHeader}>
                  <div className={styles.playerName}>{fullName(player)}</div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className={styles.row}>
              <div className={styles.label}>{tPF('fields.email')}</div>
              <div className={styles.value}>{displayOrDash(player.user?.email)}</div>
            </div>

            {/* Phone */}
            <div className={styles.row}>
              <div className={styles.label}>{tPF('fields.phoneNumber')}</div>
              <div className={styles.value}>{displayOrDash(player.user?.phoneNumber)}</div>
            </div>

            {/* Club */}
            <div className={styles.row}>
              <div className={styles.label}>{tPF('fields.club')}</div>
              <div className={styles.value}>{displayOrDash(clubName || clubId)}</div>
            </div>

            {/* DOB */}
            <div className={styles.row}>
              <div className={styles.label}>{tPF('fields.dob')}</div>
              <div className={styles.value}>
                <SafeDate value={player.user?.doB} />
              </div>
            </div>

            {/* Gender */}
            <div className={styles.row}>
              <div className={styles.label}>{tPF('fields.gender')}</div>
              <div className={styles.value}>{tGender(player.user?.gender ?? 'NotSet')}</div>
            </div>

            {/* Sports */}
            {/* <div className={styles.row}>
              <div className={styles.label}>{tPF('fields.sport')}</div>
              <div className={styles.value}>{sportsText}</div>
            </div> */}

            <div className={styles.row}>
              <div className={styles.label}>{tPF('fields.sport')}</div>

              <div className={styles.value}>
                {sportsChips.length ? (
                  <div className={styles.sportsChips}>
                    {sportsChips.map((sp) => (
                      <div key={sp.sport} className={styles.sportChip}>
                        <span className={styles.sportName}>{tPF(`sports.${sp.sport}`)}</span>
                        <span className={styles.sportLevelField}>{tPF('fields.level')}</span>
                        <span className={styles.sportLevel}>{sp.level}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  DASH
                )}
              </div>
            </div>

            {/* Created */}
            {'createdAt' in player && (
              <div className={styles.row}>
                <div className={styles.label}>{tPD('fields.created')}</div>
                <div className={styles.value}>
                  <SafeDate value={(player as any).createdAt} />
                </div>
              </div>
            )}

            {/* Updated */}
            {'updatedAt' in player && (
              <div className={styles.row}>
                <div className={styles.label}>{tPD('fields.updated')}</div>
                <div className={styles.value}>
                  <SafeDate value={(player as any).updatedAt} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
