

'use client';

import { useMemo, useState } from 'react';
import styles from './ScheduleDay.module.scss';

import Clock from '@/app/assets/icons/Clock.svg';
import Money from '@/app/assets/icons/walletProfileClub.svg';
import Courts from '@/app/assets/icons/FootballField.svg';
import ArrowRight from '@/app/assets/icons/Arrow.svg';

import data from '@/data/dataSchedule.json';




type Item = {
  id: number;
  time: string;
  title: string;
  coach: string;
  duration_min: number;
  price_uah: number;
  courts: number;
  availability: { taken: number; capacity: number };
  description?: string;
};

const currencyLabel = (code: string) => (code === 'UAH' ? 'грн' : code);

export default function ScheduleDay() {
  const [activeId, setActiveId] = useState<number | null>(3);
  const ccy = useMemo(() => currencyLabel((data ).currency), []);

  const filterButtons = [
    { id: 1, label: 'Всі' },
    { id: 2, label: 'Ігрові' },
    { id: 3, label: 'Дитячі' },
    { id: 4, label: 'Оренда кортів' },
  ];

  return (
    <section className={styles.schedule}>
        <div className={styles.filterButtons}>
        {filterButtons.map((btn) => (
          <button
            key={btn.id}
            type="button"
            className={`${styles.filterButton} ${
              activeId === btn.id ? styles.activeFilter : ''
            }`}
            onClick={() => setActiveId(btn.id)}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div className={styles.frame}>
        {(data ).items.map((item: Item, idx: number) => {
          const isActive = activeId === item.id;

          return (
            <div key={item.id} className={styles.itemWrapper}>
              <div
                className={`${styles.row} ${idx === 0 ? styles.first : ''} ${
                  isActive ? styles.active : ''
                }`}
                //  className={styles.row}
                onClick={() => setActiveId(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveId(item.id)}
              >
                <div className={styles.time}>{item.time}</div>

                <div className={styles.main}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.coach}>{item.coach}</div>
                </div>

                <div className={styles.tags}>
                    <div className={styles.iconWrapper}>
                  <Clock className={styles.icon} aria-hidden />
                  </div>
                  <span>{item.duration_min} хвилин</span>
                </div>
                <div className={styles.tags}>
                    <div className={styles.iconWrapper}>
                  <Money className={styles.icon} aria-hidden />
                  </div>
                  <span>
                    {item.price_uah} {ccy}
                  </span>
                </div>
                <div className={styles.tags}>
                    <div className={styles.iconWrapper}>
                  <Courts className={styles.icon} aria-hidden />
                  </div>
                  <span>{item.courts} корти</span>
                </div>

                <div className={styles.availability}>
                  <div className={styles.availLabel}>Доступно:</div>
                  <div className={styles.availValue}>
                    <span className={styles.availTaken}>
                    {item.availability.taken}</span> / {item.availability.capacity} людей
                  </div>
                </div>

                <button className={styles.cta} aria-label="Докладніше">
                  <ArrowRight className={styles.iconButton} aria-hidden />
                </button>
              </div>

              {isActive && item.description && (
                <p className={styles.desc}>{item.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
//==========================================

