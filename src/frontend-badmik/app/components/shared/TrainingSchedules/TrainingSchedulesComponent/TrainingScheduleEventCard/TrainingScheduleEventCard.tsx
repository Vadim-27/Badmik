

'use client';

import { useTranslations } from 'next-intl';
import styles from './TrainingScheduleEventCard.module.scss';

type Props = {
  id: string;
  top: number;
  height: number;
  left?: number;
  width?: number;
  timeText: string;
  sport: string;
  type: string;
  levels: string[];
  maxPlayers: number | null;
  onClick?: (id: string) => void;
};

export default function TrainingScheduleEventCard({
  id,
  top,
  height,
  left = 0,
  width = 120,
  timeText,
  sport,
  type,
  levels,
  maxPlayers,
  onClick,
}: Props) {
  const tS = useTranslations('sportType');
  const tT = useTranslations('trainingType');

  const levelText = levels.length ? levels.join(', ') : '—';

  return (
    <div
      className={styles.event}
      style={{ top, height, left, width }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation();
              onClick(id);
            }
          : undefined
      }
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onClick(id);
              }
            }
          : undefined
      }
    >
      <div className={styles.inner}>
        <div className={styles.time}>{timeText}</div>

        <div className={styles.badgesRow}>
          <span className={`${styles.badge} ${styles.badgePrimary}`}>
            {tT(type as any)}
          </span>

          <span className={`${styles.badge} ${styles.badgeSecondary}`}>
            {tS(sport as any)}
          </span>
        </div>

        {/* <div className={styles.divider} /> */}

        <div className={styles.footer}>
          {!!levels.length && (
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Level</span>
              <span className={styles.infoValue}>
                {levels.length === 1 ? `рівень ${levelText}` : `рівні ${levelText}`}
              </span>
            </div>
          )}

          <div className={styles.infoBlock}>
            <span className={styles.infoLabel}>Players</span>
            <span className={styles.infoValue}>
              {maxPlayers ?? '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}