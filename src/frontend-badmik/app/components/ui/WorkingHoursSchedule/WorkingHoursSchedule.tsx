'use client';

import React from 'react';
import styles from './WorkingHoursSchedule.module.scss';
import type { WorkingHourDto } from '@/app/components/ui/WorkingHoursField/WorkingHoursField';

const DAYS = [
  { key: 'monday',    label: 'Понеділок' },
  { key: 'tuesday',   label: 'Вівторок' },
  { key: 'wednesday', label: 'Середа' },
  { key: 'thursday',  label: 'Четвер' },
  { key: 'friday',    label: "П'ятниця" },
  { key: 'saturday',  label: 'Субота' },
  { key: 'sunday',    label: 'Неділя' },
] as const;

type DayKey = typeof DAYS[number]['key'];

type Props = {
  value?: WorkingHourDto | null;
  title?: string;
};

const EMPTY: WorkingHourDto = {
  monday: { from: null, to: null },
  tuesday: { from: null, to: null },
  wednesday: { from: null, to: null },
  thursday: { from: null, to: null },
  friday: { from: null, to: null },
  saturday: { from: null, to: null },
  sunday: { from: null, to: null },
};

const isValidRange = (from: string | null, to: string | null) =>
  Boolean(from && to && from < to);

export default function WorkingHoursSchedule({ value, title = 'Графік роботи' }: Props) {
  const hours = value ?? EMPTY;

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{title}</div>

      <div className={styles.table}>
        {DAYS.map(({ key, label }) => {
          const day = hours[key as DayKey] ?? { from: null, to: null };
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
                <span className={styles.dayLabel}>{label}</span>
              </div>

              <div className={styles.timeCell}>
                {active ? (
                  <span className={styles.timeText}>
                    {from} – {to}
                  </span>
                ) : (
                  <span className={styles.timeOff}>Вихідний</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
