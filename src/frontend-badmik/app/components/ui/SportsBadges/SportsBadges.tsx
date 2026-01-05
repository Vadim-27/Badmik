
//==============================


'use client';

import React, { useMemo } from 'react';
import styles from './SportsBadges.module.scss';

import BadmintonIcon from '@/app/assets/icons/shuttle.svg';
import PadelIcon from '@/app/assets/icons/padel.svg';
import SquashIcon from '@/app/assets/icons/Squash.svg';
import TableTennisIcon from '@/app/assets/icons/TableTennis.svg';
import TennisIcon from '@/app/assets/icons/Tennis.svg';
import PickleballIcon from '@/app/assets/icons/shuttle.svg';
import Tooltip from '@/app/components/ui/Tooltip/Tooltip';

export type SportType =
  | 'Badminton'
  | 'Squash'
  | 'Padel'
  | 'Pickleball'
  | 'Tennis'
  | 'TableTennis';

export type LocationSportDto = {
  sportType: SportType;
  courtCount: number;
};

type Props = {
  
  sports?: { sportType: SportType; courtCount: number }[] | null;

  sportTypes?: SportType[] | null;

  className?: string;
  // withTooltip?: boolean;
  showZero?: boolean;
};

const ICON_BY_TYPE: Record<SportType, React.ComponentType<any>> = {
  Badminton: BadmintonIcon,
  Squash: SquashIcon,
  Padel: PadelIcon,
  Pickleball: PickleballIcon,
  Tennis: TennisIcon,
  TableTennis: TableTennisIcon,
};

const LABEL_BY_TYPE: Record<SportType, string> = {
  Badminton: 'Badminton',
  Squash: 'Squash',
  Padel: 'Padel',
  Pickleball: 'Pickleball',
  Tennis: 'Tennis',
  TableTennis: 'Table Tennis',
};

const ORDER: SportType[] = [
  'Badminton',
  'Squash',
  'Padel',
  'Pickleball',
  'Tennis',
  'TableTennis',
];

export default function SportsBadges({
  sports,
  sportTypes,
  className,
  // withTooltip = true,
  showZero = false,
}: Props) {
  const items = useMemo<LocationSportDto[]>(() => {
  
    if (Array.isArray(sports) && sports.length) {
      return sports
        .map((s) => ({
          sportType: s.sportType,
          courtCount: Number(s.courtCount) || 0,
        }))
        .filter((s) => showZero || s.courtCount > 0)
        .slice()
        .sort((a, b) => ORDER.indexOf(a.sportType) - ORDER.indexOf(b.sportType));
    }

   
    if (Array.isArray(sportTypes) && sportTypes.length) {
      return sportTypes
        .map((t) => ({ sportType: t, courtCount: 0 }))
        .filter((s) => showZero || s.courtCount > 0) 
        .slice()
        .sort((a, b) => ORDER.indexOf(a.sportType) - ORDER.indexOf(b.sportType));
    }

    return [];
  }, [sports, sportTypes, showZero]);

  if (!items.length) return <span className={styles.empty}>—</span>;

  return (
    <div className={`${styles.wrap} ${className ?? ''}`}>
      {items.map((s) => {
        const Icon = ICON_BY_TYPE[s.sportType];
        const label = LABEL_BY_TYPE[s.sportType];
         const tooltipContent = `${label}: ${s.courtCount}`;

        return (
          // <span key={s.sportType} className={styles.badge} aria-label={`${label}: ${s.courtCount}`}>
          //   <Icon className={styles.icon} aria-hidden />
          //   <span className={styles.count}>{s.courtCount}</span>

          //   {withTooltip && (
          //     <span className={styles.tooltip}>
          //       {label}: {s.courtCount}
          //     </span>
          //   )}
          // </span>
          <Tooltip key={s.sportType} content={tooltipContent}>
      <span className={styles.badge} aria-label={tooltipContent}>
        <Icon className={styles.icon} aria-hidden />
        <span className={styles.count}>{s.courtCount}</span>
      </span>
    </Tooltip>
        );
      })}
    </div>
  );
}
