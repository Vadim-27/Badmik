
'use client';

import React from 'react';
import styles from './WorkingHoursSchedule.module.scss';
import type { WorkingHoursDto } from '@/services/types/working-hours.dto';
import { useTranslations } from 'next-intl';

const DAYS = [
  { key: 'monday' },
  { key: 'tuesday' },
  { key: 'wednesday' },
  { key: 'thursday' },
  { key: 'friday' },
  { key: 'saturday' },
  { key: 'sunday' },
] as const;

type DayKey = typeof DAYS[number]['key'];

type Props = {
  value?: WorkingHoursDto | null;
  title?: string; // optional override
};

const EMPTY: WorkingHoursDto = {
  monday: { from: null, to: null },
  tuesday: { from: null, to: null },
  wednesday: { from: null, to: null },
  thursday: { from: null, to: null },
  friday: { from: null, to: null },
  saturday: { from: null, to: null },
  sunday: { from: null, to: null },
};

const isValidRange = (from: string | null, to: string | null) => Boolean(from && to && from < to);

export default function WorkingHoursSchedule({ value, title }: Props) {
  const t = useTranslations('WorkingHoursField');

  const hours = value ?? EMPTY;
  const resolvedTitle = title ?? t('label'); // "Робочі години"

  const safeDayLabel = (day: DayKey) => {
    try {
      return t(`days.${day}`);
    } catch {
      return day;
    }
  };

  const dash = (() => {
    try {
      return t('dash'); // "–"
    } catch {
      return '–';
    }
  })();

  const offText = (() => {
    // додаси ключ WorkingHoursField.off
    try {
      return t('off');
    } catch {
      return 'Вихідний';
    }
  })();

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{resolvedTitle}</div>

      <div className={styles.table}>
        {DAYS.map(({ key }) => {
          const day = hours[key] ?? { from: null, to: null };
          const from = day.from ?? null;
          const to = day.to ?? null;

          const active = Boolean(from && to);
          const bad = active && !isValidRange(from, to);

          return (
            <div
              key={key}
              className={[
                styles.row,
                active ? styles.rowActive : styles.rowInactive,
                bad ? styles.rowBad : '',
              ].join(' ')}
            >
              <div className={styles.dayCell}>
                <span className={active ? styles.dotActive : styles.dotInactive} />
                <span className={styles.dayLabel}>{safeDayLabel(key)}</span>
              </div>

              <div className={styles.timeCell}>
                {active ? (
                  <span className={styles.timeText}>
                    {from} {dash} {to}
                  </span>
                ) : (
                  <span className={styles.timeOff}>{offText}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

