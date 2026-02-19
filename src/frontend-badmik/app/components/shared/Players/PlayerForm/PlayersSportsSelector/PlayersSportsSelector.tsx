


'use client';

import { useController, type Control } from 'react-hook-form';
import type { PlayerFormValues, SportType, PlayerLevel } from '../PlayerForm';
import styles from './PlayersSportsSelector.module.scss';
import { useTranslations } from 'next-intl';

const SPORTS: { key: string; label: SportType; value: SportType }[] = [
  { key: 'badminton', label: 'Badminton', value: 'Badminton' },
  { key: 'squash', label: 'Squash', value: 'Squash' },
  { key: 'tableTennis', label: 'TableTennis', value: 'TableTennis' },
  { key: 'padel', label: 'Padel', value: 'Padel' },
  { key: 'pickleball', label: 'Pickleball', value: 'Pickleball' },
  { key: 'tennis', label: 'Tennis', value: 'Tennis' },
];

const LEVELS: PlayerLevel[] = ['D', 'C', 'B', 'A', 'Master'];

type SportProfileForm = { sport: SportType; level: PlayerLevel };

type Props = {
  control: Control<PlayerFormValues>;
  labelClassName: string;
  helpClassName: string;
  label?: string;
  levelLabel?: string;
  disabled?: boolean;
};

export default function PlayersSportsSelector({
  control,
  labelClassName,
  helpClassName,
  label = 'Види спорту та рівень',
  levelLabel = 'Рівень',
  disabled = false,
}: Props) {
  const { field } = useController<PlayerFormValues, 'sportProfiles'>({
    control,
    name: 'sportProfiles',
  });

  const value: SportProfileForm[] = Array.isArray(field.value) ? field.value : [];

  const tPF = useTranslations('PlayerForm');

  const isEnabled = (sport: SportType) => value.some((sp) => sp.sport === sport);

  const getLevel = (sport: SportType): PlayerLevel => {
    const found = value.find((sp) => sp.sport === sport);
    return (found?.level ?? 'D') as PlayerLevel;
  };

  const toggleSport = (sport: SportType) => {
    if (disabled) return;

    if (isEnabled(sport)) {
      field.onChange(value.filter((sp) => sp.sport !== sport));
      return;
    }

    field.onChange([...value, { sport, level: 'D' }]);
  };

  const setLevel = (sport: SportType, level: PlayerLevel) => {
    if (disabled) return;

    const next = value.map((sp) => (sp.sport === sport ? { ...sp, level } : sp));
    field.onChange(next);
  };

  return (
    <div>
      <label className={labelClassName}>{label}</label>

      <div className={styles.sportGrid}>
        {SPORTS.map((sport) => {
          const enabled = isEnabled(sport.value);
          const level = getLevel(sport.value);

          return (
            <div key={sport.key} className={styles.sportItem}>
              <button
                type="button"
                disabled={disabled}
                className={`${styles.sportBtn} ${enabled ? styles.sportBtnActive : ''}`}
                onClick={() => toggleSport(sport.value)}
              >
                {tPF(`sports.${sport.value}`)}
              </button>

              <div className={styles.sportInputRow}>
                <span className={styles.sportUnits}>{levelLabel}:</span>

                <select
                  className={styles.sportSelect}
                  value={level}
                  disabled={!enabled || disabled}
                  onChange={(e) => setLevel(sport.value, e.target.value as PlayerLevel)}
                >
                  {LEVELS.map((lv) => (
                    <option key={lv} value={lv}>
                      {lv}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


