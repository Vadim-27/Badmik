'use client';

import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { useState } from 'react';
import styles from './WorkingHoursField.module.scss';

const DAYS = [
  { key: 'monday',    label: 'Понеділок'  },
  { key: 'tuesday',   label: 'Вівторок'   },
  { key: 'wednesday', label: 'Середа'     },
  { key: 'thursday',  label: 'Четвер'     },
  { key: 'friday',    label: "П'ятниця"   },
  { key: 'saturday',  label: 'Субота'     },
  { key: 'sunday',    label: 'Неділя'     },
] as const;

type DayKey = typeof DAYS[number]['key'];

export type TimeRangeDto = { from: string | null; to: string | null };
export type WorkingHourDto = Record<DayKey, TimeRangeDto>;

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;

  name: Path<TFieldValues>;
  
  onSerializedChange?: (json: string) => void;
};

export default function WorkingHoursField<TFieldValues extends FieldValues>({
  control,
  name,
  onSerializedChange,
}: Props<TFieldValues>) {
  const [bulkFrom, setBulkFrom] = useState('09:00');
  const [bulkTo, setBulkTo] = useState('18:00');

  const isValidRange = (from: string | null, to: string | null) =>
    Boolean(from && to && from < to);

  const EMPTY: WorkingHourDto = {
    monday: { from: null, to: null },
    tuesday: { from: null, to: null },
    wednesday: { from: null, to: null },
    thursday: { from: null, to: null },
    friday: { from: null, to: null },
    saturday: { from: null, to: null },
    sunday: { from: null, to: null },
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={EMPTY as any}
      render={({ field: { value, onChange }, fieldState }) => {
        const hours: WorkingHourDto = (value as WorkingHourDto) ?? EMPTY;

        const emit = (next: WorkingHourDto) => {
          onChange(next as any);
          onSerializedChange?.(JSON.stringify(next));
        };

        const setDay = (day: DayKey, patch: Partial<TimeRangeDto>) => {
          const prev = hours[day] ?? { from: null, to: null };
          const next: WorkingHourDto = { ...hours, [day]: { ...prev, ...patch } };
          emit(next);
        };

        const applyWeekdays = () => {
          const next: WorkingHourDto = { ...hours };
          for (const d of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const) {
            next[d] = { from: bulkFrom, to: bulkTo };
          }
          emit(next);
        };

        const clearAll = () => emit(EMPTY);

        return (
          <div className={styles.wrapper}>
            <label className={styles.label}>Робочі години</label>

            {/* верхній бар: масове заповнення Пн–Пт + очистити */}
            <div className={styles.bulkBar}>
              <div className={styles.bulkInputs}>
                <input
                  type="time"
                  value={bulkFrom}
                  onChange={(e) => setBulkFrom(e.target.value)}
                  className={styles.input}
                />
                <span>–</span>
                <input
                  type="time"
                  value={bulkTo}
                  onChange={(e) => setBulkTo(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.bulkButtons}>
                <button type="button" className={styles.button} onClick={applyWeekdays}>
                  Пн–Пт
                </button>
                <button type="button" className={styles.buttonGhost} onClick={clearAll}>
                  Очистити все
                </button>
              </div>
            </div>

            {/* таблиця днів */}
            <div className={styles.table}>
              {DAYS.map(({ key, label }) => {
                const from = hours[key]?.from ?? null;
                const to = hours[key]?.to ?? null;
                const active = Boolean(from && to);
                const bad = active && !isValidRange(from, to);

                return (
                  <div key={key} className={styles.row}>
                    <div className={styles.dayCell}>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) =>
                          e.target.checked
                            ? setDay(key, { from: bulkFrom, to: bulkTo })
                            : setDay(key, { from: null, to: null })
                        }
                      />
                      <span className={styles.dayLabel}>{label}</span>
                    </div>

                    <div className={styles.timeCell}>
                      <input
                        type="time"
                        value={from ?? ''}               
                        onChange={(e) => setDay(key, { from: e.target.value || null })}
                        disabled={!active}
                        className={`${styles.input} ${bad ? styles.errorInput : ''}`}
                      />
                      <span>–</span>
                      <input
                        type="time"
                        value={to ?? ''}
                        onChange={(e) => setDay(key, { to: e.target.value || null })}
                        disabled={!active}
                        className={`${styles.input} ${bad ? styles.errorInput : ''}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {fieldState.error && <p className={styles.errorText}>{fieldState.error.message}</p>}
          </div>
        );
      }}
    />
  );
}


