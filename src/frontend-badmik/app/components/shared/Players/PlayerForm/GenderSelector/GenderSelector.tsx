

'use client';

import { useController, type Control } from 'react-hook-form';
import type { Gender } from '@/services/types/players.dto';
import type { PlayerFormValues } from '../PlayerForm';
import styles from './GenderSelector.module.scss';

type Props = {
  control: Control<PlayerFormValues>;
  label: string;
  maleLabel: string;
  femaleLabel: string;
  disabled?: boolean;
};

export default function GenderSelector({
  control,
  label,
  maleLabel,
  femaleLabel,
  disabled = false,
}: Props) {
  const { field } = useController<PlayerFormValues, 'gender'>({
    control,
    name: 'gender',
  });

  const value: Gender = (field.value ?? 'NotSet') as Gender;

  const set = (next: Gender) => field.onChange(next);

  const toggle = (pick: 'Male' | 'Female') => {
    if (disabled) return;
    if (value === pick) set('NotSet');
    else set(pick);
  };

  return (
    <div >
      <label className={styles.label}>{label}</label>

      <div className={styles.row}>
        <button
          type="button"
          disabled={disabled}
          className={`${styles.btn} ${value === 'Male' ? styles.btnActive : ''}`}
          onClick={() => toggle('Male')}
        >
          {maleLabel}
        </button>

        <button
          type="button"
          disabled={disabled}
          className={`${styles.btn} ${value === 'Female' ? styles.btnActive : ''}`}
          onClick={() => toggle('Female')}
        >
          {femaleLabel}
        </button>
      </div>
    </div>
  );
}

