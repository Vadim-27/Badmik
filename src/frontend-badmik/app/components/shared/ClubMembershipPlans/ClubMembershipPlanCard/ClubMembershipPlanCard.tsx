// src/app/components/shared/ClubMembershipPlans/ClubMembershipPlanCard/ClubMembershipPlanCard.tsx
'use client';

import { useTranslations } from 'next-intl';
import styles from './ClubMembershipPlanCard.module.scss';

import type { ClubMembershipPlan } from '@/services/types/clubMembershipPlans.dto';

type Props = {
  plan: ClubMembershipPlan;
  onEdit?: () => void;
};

export default function ClubMembershipPlanCard({ plan, onEdit }: Props) {
  const t = useTranslations('ClubMembershipPlans');

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.title}>{plan.name}</div>

          
          <div className={styles.tags}>
            <span
  className={`${styles.badge} ${
    !plan.isActive ? styles.badgeInactive : ''
  }`}
>
            {plan.isActive ? t('status.active') : t('status.inactive')}
          </span>
        <span className={styles.sportType}>{t(`sportType.${plan.sportType}`)}</span>
        <span className={styles.trainingType}>{t(`trainingType.${plan.trainingType}`)}</span>
      </div>
          {/* <span className={styles.tag}>{t(`sportType.${plan.sportType}`)}</span>
          <span className={styles.tag}>{t(`trainingType.${plan.trainingType}`)}</span> */}
        </div>

        

        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <b>{plan.trainingsGranted}</b> {t('trainings')}
          </div>
          <div className={styles.metaItem}>
            <b>{plan.durationDays}</b> {t('days')}
          </div>
          {/* <div className={styles.metaId}>ID: {String(plan.id).slice(0, 8)}…</div> */}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btnOutline} onClick={onEdit}>
          {t('cardButtons.edit')}
        </button>
      </div>
    </div>
  );
}
