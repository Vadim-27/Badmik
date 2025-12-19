'use client';

import React, { useMemo, useState } from 'react';
import styles from './LocationDetails.module.scss';

import WorkingHoursSchedule from '@/app/components/ui/WorkingHoursSchedule/WorkingHoursSchedule';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

import type { Location } from '@/services/types/locations.dto';
import type { Club } from '@/services/types/clubs.dto';
import SafeDate from '@/app/components/ui/SafeDate/SafeDate';
import SportsBadges from '@/app/components/ui/SportsBadges/SportsBadges';

type Props = {
  location: Location;
  club?: Club | null;
};



function formatWorkingHours(wh: any) {
  if (!wh) return null;

  const days: Array<[string, any]> = [
    ['Пн', wh.monday],
    ['Вт', wh.tuesday],
    ['Ср', wh.wednesday],
    ['Чт', wh.thursday],
    ['Пт', wh.friday],
    ['Сб', wh.saturday],
    ['Нд', wh.sunday],
  ];

  return days
    .map(([label, tr]) => {
      const from = tr?.from ?? null;
      const to = tr?.to ?? null;
      if (!from || !to) return `${label}: —`;
      return `${label}: ${from}–${to}`;
    })
    .join('\n');
}

const LocationDetails: React.FC<Props> = ({ location, club }) => {
  const {
    id,
    clubId,
    name,
    city,
    address,
    label,
    isActive,
    order,
    priceText,
    description,
    sports,
    sportTypes,
    amenities,
    workingHours,
    createdAt,
    updatedAt,
  } = location as any;

  const [showSchedule, setShowSchedule] = useState(false);

  const sportsText = useMemo(() => {
    if (sports?.length) {
      return sports
        .map((s: any) => `${s.sportType}${s.courtCount ? ` (${s.courtCount})` : ''}`)
        .join(', ');
    }
    if (sportTypes?.length) return sportTypes.join(', ');
    return '—';
  }, [sports, sportTypes]);

  const amenitiesText = useMemo(() => {
    if (!amenities?.length) return '—';
    return amenities.join(', ');
  }, [amenities]);

//   const whText = useMemo(() => formatWorkingHours(workingHours), [workingHours]);

  return (
    <section className={styles.wrapper}>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <div className="text-lg font-semibold">
          <h1 className={styles.title}>{name || 'Локація без назви'}</h1>
        </div>

        {/* ✅ поправ шлях, якщо у тебе інша структура */}
        <EditButton href={`/admin/locations/${id}/edit-location`} label="buttons.update" />
      </ActionHeader>

      <div className={styles.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: 'Admin', href: '/admin/dashboard' },
            { label: 'Locations', href: '/admin/locations' },
            { label: 'Location' },
          ]}
        />
      </div>

      <div className={styles.statusActiveWrapper}>
        <span className={isActive ? styles.statusActive : styles.statusInactive}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.label}>Name</div>
          <div className={styles.value}>{name || '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Club</div>
          <div className={styles.value}>{club?.name ? club.name : clubId ? clubId : '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>City</div>
          <div className={styles.value}>{city || '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Address</div>
          <div className={styles.value}>{address || '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Label</div>
          <div className={styles.value}>{label && label !== 'None' ? label : '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Order</div>
          <div className={styles.value}>{typeof order === 'number' ? order : '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Price</div>
          <div className={styles.value}>{priceText?.trim() ? priceText : '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Sports</div>
          <div className={styles.value}>
             <SportsBadges sports={location.sports} sportTypes={location.sportTypes} />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Amenities</div>
          <div className={styles.value}>{amenitiesText}</div>
        </div>

        <div className={`${styles.row} ${styles.rowDescription}`}>
          <div className={styles.label}>Description</div>
          <div className={`${styles.value} ${styles.valueMultiline}`}>
            {description?.trim() ? description : 'Опис відсутній'}
          </div>
        </div>

        <div className={`${styles.row} ${styles.rowDescription}`}>
          <div className={styles.label}>Working hours</div>

          <div className={styles.value}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${showSchedule ? styles.toggleBtnActive : ''}`}
              onClick={() => setShowSchedule((v) => !v)}
            >
              {showSchedule ? 'Сховати графік роботи' : 'Показати графік роботи'}
            </button>

            {showSchedule && (
              <div className={styles.scheduleBox}>
                <WorkingHoursSchedule value={workingHours} />
              </div>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Created</div>
          <div className={styles.value}><SafeDate value={location.createdAt} /></div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Updated</div>
          <div className={styles.value}><SafeDate value={location.updatedAt} /></div>
        </div>
      </div>
    </section>
  );
};

export default LocationDetails;
