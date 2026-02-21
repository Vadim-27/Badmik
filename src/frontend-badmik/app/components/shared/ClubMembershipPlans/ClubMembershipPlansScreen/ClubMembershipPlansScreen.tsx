// src/app/components/shared/ClubMembershipPlans/ClubMembershipPlansScreen/ClubMembershipPlansScreen.tsx
'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import styles from './ClubMembershipPlansScreen.module.scss';

import { useClubMembershipPlansList } from '@/services/clubMembershipPlans/queries.client';
import type { ClubMembershipPlan } from '@/services/types/clubMembershipPlans.dto';
import type { SportType, TrainingType } from '@/services/types/playerMemberships.dto';

import ClubMembershipPlanCard from '../ClubMembershipPlanCard/ClubMembershipPlanCard';

const SPORT_TYPES: SportType[] = ['Badminton', 'Squash', 'Padel', 'Pickleball', 'Tennis', 'TableTennis'];
const TRAINING_TYPES: TrainingType[] = ['Kids', 'Individual', 'Educational', 'Group', 'CourtRental'];

type Props = {
  clubId: string;
  onEdit?: (id: string) => void;
};

export default function ClubMembershipPlansScreen({ clubId, onEdit }: Props) {
  const t = useTranslations('ClubMembershipPlans');

  const q = useClubMembershipPlansList(clubId);

  const [sport, setSport] = useState<SportType | 'all'>('all');
  const [trainingType, setTrainingType] = useState<TrainingType | 'all'>('all');
  const [search, setSearch] = useState('');

  const list = useMemo<ClubMembershipPlan[]>(
    () => (Array.isArray(q.data) ? q.data : []),
    [q.data],
  );

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return list.filter((p) => {
      const okSport = sport === 'all' ? true : p.sportType === sport;
      const okType = trainingType === 'all' ? true : p.trainingType === trainingType;
      const okSearch = !s ? true : String(p.name ?? '').toLowerCase().includes(s);
      return okSport && okType && okSearch;
    });
  }, [list, sport, trainingType, search]);

  const active = useMemo(() => filtered.filter((x) => x.isActive), [filtered]);
  const inactive = useMemo(() => filtered.filter((x) => !x.isActive), [filtered]);

  const reset = () => {
    setSport('all');
    setTrainingType('all');
    setSearch('');
  };

  return (
    <div className={styles.wrapper}>
      {/* Filters bar */}
      <div className={styles.filters}>
        <select value={sport} onChange={(e) => setSport((e.target.value as any) ?? 'all')} className={styles.select}>
          <option value="all">{t('filters.sportAll')}</option>
          {SPORT_TYPES.map((v) => (
            <option key={v} value={v}>
              {t(`sportType.${v}`)}
            </option>
          ))}
        </select>

        <select
          value={trainingType}
          onChange={(e) => setTrainingType((e.target.value as any) ?? 'all')}
          className={styles.select}
        >
          <option value="all">{t('filters.trainingTypeAll')}</option>
          {TRAINING_TYPES.map((v) => (
            <option key={v} value={v}>
              {t(`trainingType.${v}`)}
            </option>
          ))}
        </select>

        <input
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('filters.searchPlaceholder')}
        />

        <button type="button" className={styles.btnGhost} onClick={reset}>
          {t('filters.reset')}
        </button>
      </div>

      {/* States */}
      {q.isLoading ? <div className={styles.skeleton} /> : null}
      {q.isError ? <div className={styles.error}>{t('error')}</div> : null}

      {/* Active */}
      {q.isSuccess ? (
        <>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              {t('activeTitle')} <span className={styles.sectionCount}>{active.length}</span>
            </div>
          </div>

          <div className={styles.grid}>
            {active.map((p) => (
              <ClubMembershipPlanCard key={p.id} plan={p} onEdit={() => onEdit?.(p.id)} />
            ))}
          </div>

          {/* Inactive */}
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              {t('inactiveTitle')} <span className={styles.sectionCount}>{inactive.length}</span>
            </div>
          </div>

          <div className={styles.grid}>
            {inactive.map((p) => (
              <ClubMembershipPlanCard key={p.id} plan={p} onEdit={() => onEdit?.(p.id)} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
