'use client';

import React, { useMemo } from 'react';
import styles from './LocationDetails.module.scss';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

import type { Location } from '@/services/types/locations.dto';
import type { Club } from '@/services/types/clubs.dto';

type Props = {
  location: Location;
  club?: Club | null;
};

function fmtDate(v?: string | null) {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString('uk-UA', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

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

  const whText = useMemo(() => formatWorkingHours(workingHours), [workingHours]);

  return (
    <section className={styles.wrapper}>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h1 className="text-lg font-semibold">
          <h1 className={styles.title}>{name || 'Локація без назви'}</h1>
        </h1>

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
          <div className={styles.value}>
            {club?.name ? club.name : clubId ? clubId : '—'}
          </div>
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
          <div className={styles.value}>{sportsText}</div>
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
          <div className={`${styles.value} ${styles.valueMultiline}`}>
            {whText || '—'}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Created</div>
          <div className={styles.value}>{fmtDate(createdAt)}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Updated</div>
          <div className={styles.value}>{fmtDate(updatedAt)}</div>
        </div>
      </div>
    </section>
  );
};

export default LocationDetails;
