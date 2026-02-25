'use client';

import { Control, useController } from 'react-hook-form';
import type { LocationFormValues } from '../LocationsForm';
import styles from './SportsSelector.module.scss';
import { useTranslations } from 'next-intl';

const SPORTS = [
  {
    key: 'badminton',
    sportType: 'Badminton',
    unitKey: 'courts',
    enabledName: 'sports.badmintonEnabled',
    amountName: 'sports.badmintonCourts',
  },
  {
    key: 'squash',
    sportType: 'Squash',
    unitKey: 'courts',
    enabledName: 'sports.squashEnabled',
    amountName: 'sports.squashCourts',
  },
  {
    key: 'tableTennis',
    sportType: 'TableTennis',
    unitKey: 'tables',
    enabledName: 'sports.tableTennisEnabled',
    amountName: 'sports.tableTennisTables',
  },
  {
    key: 'padel',
    sportType: 'Padel',
    unitKey: 'courts',
    enabledName: 'sports.padelEnabled',
    amountName: 'sports.padelCourts',
  },
  {
    key: 'pickleball',
    sportType: 'Pickleball',
    unitKey: 'courts',
    enabledName: 'sports.pickleballEnabled',
    amountName: 'sports.pickleballCourts',
  },
  {
    key: 'tennis',
    sportType: 'Tennis',
    unitKey: 'courts',
    enabledName: 'sports.tennisEnabled',
    amountName: 'sports.tennisCourts',
  },
] as const;

type SportConfig = (typeof SPORTS)[number];

type EnabledFieldName =
  | 'sports.badmintonEnabled'
  | 'sports.squashEnabled'
  | 'sports.tableTennisEnabled'
  | 'sports.padelEnabled'
  | 'sports.pickleballEnabled'
  | 'sports.tennisEnabled';

type AmountFieldName =
  | 'sports.badmintonCourts'
  | 'sports.squashCourts'
  | 'sports.tableTennisTables'
  | 'sports.padelCourts'
  | 'sports.pickleballCourts'
  | 'sports.tennisCourts';

type Props = {
  control: Control<LocationFormValues>;
  labelClassName: string;
  helpClassName: string;
};

export default function SportsSelector({ control, labelClassName, helpClassName }: Props) {
  const t = useTranslations('locationForm');
  const tSports = useTranslations('locationSports');

  return (
    <div>
      <label className={labelClassName}>{t('sports.title')}</label>

      <div className={styles.sportGrid}>
        {SPORTS.map((sport: SportConfig) => {
          const { field: enabledField } = useController({
            control,
            name: sport.enabledName as EnabledFieldName,
          });

          const { field: amountField } = useController({
            control,
            name: sport.amountName as AmountFieldName,
          });

          const isEnabled = Boolean(enabledField.value);

          return (
            <div key={sport.key} className={styles.sportItem}>
              <label
                className={`${styles.sportBtn} ${
                  isEnabled ? styles.sportBtnActive : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => enabledField.onChange(e.target.checked)}
                />
                {tSports(sport.sportType)}
              </label>

              <div className={styles.sportInputRow}>
                <span className={styles.sportUnits}>
                  {t(`sports.units.${sport.unitKey}`)}:
                </span>

                <input
                  type="number"
                  min={0}
                  disabled={!isEnabled}
                  className={styles.sportInput}
                  value={amountField.value ?? 0}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const n = raw === '' || Number.isNaN(Number(raw)) ? 0 : Number(raw);
                    amountField.onChange(n);
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className={helpClassName}>{t('sports.help')}</p>
    </div>
  );
}



//========================================================


// 'use client';

// import { Control, useController } from 'react-hook-form';
// import type { LocationFormValues } from '../LocationsForm';
// import styles from './SportsSelector.module.scss';
// import { useTranslations } from 'next-intl';

// const SPORTS = [
//   {
//     key: 'badminton',
//     label: 'Badminton',
//     unit: 'Корти',
//     enabledName: 'sports.badmintonEnabled',
//     amountName: 'sports.badmintonCourts',
//   },
//   {
//     key: 'squash',
//     label: 'Squash',
//     unit: 'Корти',
//     enabledName: 'sports.squashEnabled',
//     amountName: 'sports.squashCourts',
//   },
//   {
//     key: 'tableTennis',
//     label: 'TableTennis',
//     unit: 'Столи',
//     enabledName: 'sports.tableTennisEnabled',
//     amountName: 'sports.tableTennisTables',
//   },
//   {
//     key: 'padel',
//     label: 'Padel',
//     unit: 'Корти',
//     enabledName: 'sports.padelEnabled',
//     amountName: 'sports.padelCourts',
//   },
//   {
//     key: 'pickleball',
//     label: 'Pickleball',
//     unit: 'Корти',
//     enabledName: 'sports.pickleballEnabled',
//     amountName: 'sports.pickleballCourts',
//   },
//   {
//     key: 'tennis',
//     label: 'Tennis',
//     unit: 'Корти',
//     enabledName: 'sports.tennisEnabled',
//     amountName: 'sports.tennisCourts',
//   },
// ] as const;

// type SportConfig = (typeof SPORTS)[number];

// type EnabledFieldName =
//   | 'sports.badmintonEnabled'
//   | 'sports.squashEnabled'
//   | 'sports.tableTennisEnabled'
//   | 'sports.padelEnabled'
//   | 'sports.pickleballEnabled'
//   | 'sports.tennisEnabled';

// type AmountFieldName =
//   | 'sports.badmintonCourts'
//   | 'sports.squashCourts'
//   | 'sports.tableTennisTables'
//   | 'sports.padelCourts'
//   | 'sports.pickleballCourts'
//   | 'sports.tennisCourts';

// type Props = {
//   control: Control<LocationFormValues>;
//   labelClassName: string;
//   helpClassName: string;
// };

// export default function SportsSelector({ control, labelClassName, helpClassName }: Props) {

//   const t = useTranslations('locationForm');
// const tSports = useTranslations('locationSports');
//   return (
//     <div>
//       <label className={labelClassName}>{t('sports.title')}</label>

//       <div className={styles.sportGrid}>
//         {SPORTS.map((sport: SportConfig) => {
//           const { field: enabledField } = useController({
//             control,
//             name: sport.enabledName as EnabledFieldName,
//           });

//           const { field: amountField } = useController({
//             control,
//             name: sport.amountName as AmountFieldName,
//           });

//           const isEnabled = Boolean(enabledField.value);

//           return (
//             <div key={sport.key} className={styles.sportItem}>
//               <label
//                 className={`${styles.sportBtn} ${
//                   isEnabled ? styles.sportBtnActive : ''
//                 }`}
//               >
//                 <input
//                   type="checkbox"
//                   checked={isEnabled}
//                   onChange={(e) => enabledField.onChange(e.target.checked)}
//                 />
//                 {sport.label}
//               </label>

//               <div className={styles.sportInputRow}>
//                 <span className={styles.sportUnits}>{sport.unit}:</span>
//                 <input
//                   type="number"
//                   min={0}
//                   disabled={!isEnabled}
//                   className={styles.sportInput}
//                   value={amountField.value ?? 0}
//                   onChange={(e) => {
//                     const raw = e.target.value;
//                     const n =
//                       raw === '' || Number.isNaN(Number(raw))
//                         ? 0
//                         : Number(raw);
//                     amountField.onChange(n);
//                   }}
//                   onWheel={(e) => e.currentTarget.blur()}
//                 />
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <p className={helpClassName}>
//         Після збереження система автоматично синхронізує список кортів (створить/деактивує Court).
//       </p>
//     </div>
//   );
// }
