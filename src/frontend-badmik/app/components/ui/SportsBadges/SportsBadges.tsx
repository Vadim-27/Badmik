// 'use client';

// import React, { useMemo } from 'react';
// import styles from './SportsBadges.module.scss';

// // ✅ імпорти іконок (під твої файли)
// import BadmintonIcon from '@/app/assets/icons/shuttle.svg';
// import PadelIcon from '@/app/assets/icons/padel.svg';
// import SquashIcon from '@/app/assets/icons/Squash.svg';
// import TableTennisIcon from '@/app/assets/icons/TableTennis.svg';
// import TennisIcon from '@/app/assets/icons/Tennis.svg';

// // якщо немає pickleball.svg — можна тимчасово використати shuttle або tennis
// // або додаси окрему іконку потім
// import PickleballIcon from '@/app/assets/icons/shuttle.svg';

// export type SportType = 'Badminton' | 'Squash' | 'Padel' | 'Pickleball' | 'Tennis' | 'TableTennis';

// export type LocationSportDto = {
//   sportType: SportType;
//   courtCount: number;
// };

// type Props = {
//   sports?: LocationSportDto[] | null;
//   className?: string;
//   /** показувати sportType у title/tooltip */
//   withTooltip?: boolean;
//   /** якщо true — показувати навіть якщо courtCount = 0 */
//   showZero?: boolean;
// };

// const ICON_BY_TYPE: Record<SportType, React.ComponentType<any>> = {
//   Badminton: BadmintonIcon,
//   Squash: SquashIcon,
//   Padel: PadelIcon,
//   Pickleball: PickleballIcon,
//   Tennis: TennisIcon,
//   TableTennis: TableTennisIcon,
// };

// const LABEL_BY_TYPE: Record<SportType, string> = {
//   Badminton: 'Badminton',
//   Squash: 'Squash',
//   Padel: 'Padel',
//   Pickleball: 'Pickleball',
//   Tennis: 'Tennis',
//   TableTennis: 'Table Tennis',
// };

// export default function SportsBadges({
//   sports,
//   className,
//   withTooltip = true,
//   showZero = false,
// }: Props) {
//   const items = useMemo(() => {
//     const arr = (sports ?? []).filter(Boolean);
//     const normalized = arr
//       .filter((s) => showZero || (Number(s.courtCount) ?? 0) > 0)
//       .map((s) => ({
//         sportType: s.sportType,
//         courtCount: Number(s.courtCount) || 0,
//       }));

//     // стабільний порядок
//     const order: SportType[] = [
//       'Badminton',
//       'Squash',
//       'Padel',
//       'Pickleball',
//       'Tennis',
//       'TableTennis',
//     ];

//     return normalized.sort((a, b) => order.indexOf(a.sportType) - order.indexOf(b.sportType));
//   }, [sports, showZero]);

//   if (!items.length) return <span className={styles.empty}>—</span>;

//   return (
//     <div className={`${styles.wrap} ${className ?? ''}`}>
//       {items.map((s) => {
//         const Icon = ICON_BY_TYPE[s.sportType];
//         const label = LABEL_BY_TYPE[s.sportType];

//         return (
//           <span key={s.sportType} className={styles.badge} aria-label={`${label}: ${s.courtCount}`}>
//             <Icon className={styles.icon} aria-hidden />
//             <span className={styles.count}>{s.courtCount}</span>

//             {withTooltip && (
//               <span className={styles.tooltip}>
//                 {label}: {s.courtCount}
//               </span>
//             )}
//           </span>
//         );
//       })}
//     </div>
//   );
// }


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
  // ✅ з бекенда може прийти або це:
  sports?: { sportType: SportType; courtCount: number }[] | null;
  // ✅ або старе поле:
  sportTypes?: SportType[] | null;

  className?: string;
  withTooltip?: boolean;
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
  withTooltip = true,
  showZero = false,
}: Props) {
  const items = useMemo<LocationSportDto[]>(() => {
    // 1) якщо є sports[] — беремо його
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

    // 2) fallback: sportTypes[] → courtCount=0
    if (Array.isArray(sportTypes) && sportTypes.length) {
      return sportTypes
        .map((t) => ({ sportType: t, courtCount: 0 }))
        .filter((s) => showZero || s.courtCount > 0) // якщо showZero=false, то вони зникнуть
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

        return (
          <span key={s.sportType} className={styles.badge} aria-label={`${label}: ${s.courtCount}`}>
            <Icon className={styles.icon} aria-hidden />
            <span className={styles.count}>{s.courtCount}</span>

            {withTooltip && (
              <span className={styles.tooltip}>
                {label}: {s.courtCount}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
