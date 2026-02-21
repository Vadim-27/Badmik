
// src/app/components/shared/Players/PlayerMemberships/PlayerMembershipsScreen.tsx
'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import styles from './PlayerMembershipsScreen.module.scss';

import { usePlayerMembershipsList } from '@/services/playerMemberships/queries.client';
import type { PlayerMembership } from '@/services/types/playerMemberships.dto';
import { PlayerMembershipCard } from './PlayerMembershipCard/PlayerMembershipCard';
import { useClubMembershipPlansList } from '@/services/clubMembershipPlans/queries.client';

type Props = {
  clubId: string;
  playerId: string;
  onEdit?: (id: string) => void;
  onExtend?: (membership: PlayerMembership) => void; // ✅
  onFinish?: (id: string) => void;
  disabledIds?: string[];
};

function MembershipsSkeleton() {
  return (
    <div className={styles.skeletonList} aria-hidden="true">
      <div className={styles.skeletonCard} />
      <div className={styles.skeletonCard} />
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return <div className={styles.errorBanner}>{message}</div>;
}

function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyTitle}>{title}</div>
      {hint ? <div className={styles.emptyHint}>{hint}</div> : null}
    </div>
  );
}

export default function PlayerMembershipsScreen({ clubId, playerId, onEdit, onExtend, onFinish, disabledIds }: Props) {
  const tRaw = useTranslations('PlayerMemberships');

  const t = (k: string) => {
    try {
      return tRaw(k);
    } catch {
      const fallback: Record<string, string> = {
        trainings: 'тренувань',
        left: 'Залишилось',
        used: 'Використано',
        details: 'Деталі',
        extend: 'Продовжити',
        edit: 'Редагувати',
        finish: 'Завершити',
        noDates: 'Без дат',
        statusDefault: 'Active',
        error: 'Не вдалося завантажити абонементи',
        emptyTitle: 'Немає абонементів',
        emptyHint: 'Створи перший абонемент для гравця.',
        titleMembershipCard: 'Ігрове тренування',
      };
      return fallback[k] ?? k;
    }
  };

  const q = usePlayerMembershipsList({ playerId, clubId });
  const plansQ = useClubMembershipPlansList(clubId);

const planMap = useMemo(
  () => new Map((plansQ.data ?? []).map(p => [p.id, p.name])),
  [plansQ.data]
);

  const list = useMemo<PlayerMembership[]>(
    () => (Array.isArray(q.data) ? (q.data as PlayerMembership[]) : []),
    [q.data],
  );

  const disabledSet = useMemo(() => new Set((disabledIds ?? []).map(String)), [disabledIds]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {q.isLoading ? <MembershipsSkeleton /> : null}
        {q.isError ? <ErrorBanner message={t('error')} /> : null}
        {q.isSuccess && list.length === 0 ? <EmptyState title={t('emptyTitle')} hint={t('emptyHint')} /> : null}

        {q.isSuccess && list.length > 0
          ? list.map((m) => {
              const id = String((m as any)?.id ?? '');
              const disabled = disabledSet.has(id);

              return (
                <PlayerMembershipCard
                  key={id}
                  membership={m}
                  planName={planMap.get((m as any).planId) ?? ''}
                  t={t}
                  disabled={disabled}
                  onEdit={(mid) => onEdit?.(mid)}
                  onDetails={(mid) => console.log('details', mid)}
                  onExtend={(mm) => onExtend?.(mm)} // ✅
                  onFinish={(mid) => onFinish?.(mid)}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}
