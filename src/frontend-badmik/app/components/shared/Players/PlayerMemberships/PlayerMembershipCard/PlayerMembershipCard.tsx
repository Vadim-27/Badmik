// // src/app/components/shared/Players/PlayerMemberships/PlayerMembershipCard/PlayerMembershipCard.tsx

'use client';

import styles from './PlayerMembershipCard.module.scss';
import type { PlayerMembership } from '@/services/types/playerMemberships.dto';
import TrainingsProgressBar from './TrainingsProgressBar/TrainingsProgressBar';

type TFn = (k: string) => string;

function formatDateUA(value?: string | Date | null) {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
}

function normalizeStatus(status?: string | null) {
  const s = String(status ?? '').toLowerCase();
  if (s === 'active') return 'active';
  if (s === 'frozen') return 'frozen';
  if (s === 'completed' || s === 'finished') return 'completed';
  if (s === 'cancelled' || s === 'canceled') return 'cancelled';
  return 'default';
}

function calcNumbers(m: PlayerMembership) {
  const anyM = m as any;

  const total = Number(anyM?.trainingsTotalGranted ?? 0) || 0;
  const leftRaw = Number(anyM?.trainingsLeft ?? 0) || 0;

  const left = Math.min(Math.max(leftRaw, 0), total);
  const used = Math.max(0, total - left);

  const progress = total > 0 ? Math.round((left / total) * 100) : 0;

  return { total, left, used, progress };
}

function StatusPill({ status }: { status: string }) {
  const v = normalizeStatus(status);

  return (
    <span
      className={[
        styles.statusPill,
        v === 'active' ? styles.statusActive : '',
        v === 'frozen' ? styles.statusFrozen : '',
        v === 'completed' ? styles.statusCompleted : '',
        v === 'cancelled' ? styles.statusCancelled : '',
      ].join(' ')}
    >
      {status}
    </span>
  );
}

type Props = {
  membership: PlayerMembership;
  t: TFn;
  disabled?: boolean;
  onDetails?: (id: string) => void;
  onExtend?: (membership: PlayerMembership) => void; // ✅ ВАЖЛИВО: тепер membership
  onEdit?: (id: string) => void;
  onFinish?: (id: string) => void;
  planName?: string;
};

export function PlayerMembershipCard({ membership, t, disabled, onDetails, onExtend, onEdit, onFinish, planName }: Props) {
  const anyM = membership as any;
  const id = String(anyM?.id ?? '');

  const from = formatDateUA(anyM?.validFrom);
  const until = formatDateUA(anyM?.validUntil);

  const { total, left, used, progress } = calcNumbers(membership);
  const statusLabel = String(anyM?.status ?? t('statusDefault'));

  return (
    <div className={[styles.card, disabled ? styles.cardDisabled : ''].join(' ')}>
      <div className={styles.cardTop}>
        <div className={styles.titleBlock}>
          <div className={styles.wrapperTitle}>
          <div className={styles.preTitle}>{t('titleMembershipCard')}</div>
          <div className={styles.title}>
              {planName ?? ''} 
          </div>
          </div>
          <div className={styles.chipContainer}>
          <div className={styles.trainingType}>{t(`trainingType.${membership.trainingType}`)}</div>
          <div className={styles.sportType}>{t(`sportType.${membership.sportType}`)}</div>
          </div>

          <div className={styles.subTitle}>
            {from && until ? (
              <>
                {from} — {until}
              </>
            ) : (
              <span className={styles.muted}>{t('noDates')}</span>
            )}
          </div>
        </div>

        <StatusPill status={statusLabel} />
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.leftMetric}>
          <div className={styles.metricLine}>
            <div className={styles.metricLabel}>
              {t('left')}: <span className={styles.metricValue}>{left} / {total || 0}</span>
            </div>
            <div className={styles.metricRight}>
              {t('used')}: <span className={styles.metricValue}>{used}</span>
            </div>
          </div>

          <div className={styles.progressTrack} aria-label="progress">
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            <TrainingsProgressBar total={total} remaining={left} />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnOutline} type="button" disabled={disabled} onClick={() => onDetails?.(id)}>
          {t('details')}
        </button>

        {/* ✅ тепер передаємо membership */}
        <button className={styles.btnOutline} type="button" disabled={disabled} onClick={() => onExtend?.(membership)}>
          {t('extend.cardBtn')}
        </button>

        <button className={styles.btnOutline} type="button" disabled={disabled} onClick={() => onEdit?.(id)}>
          {t('edit')}
        </button>

        <button className={styles.btnDanger} type="button" disabled={disabled} onClick={() => onFinish?.(id)}>
          {t('finish')}
        </button>
      </div>
    </div>
  );
}


//================================

