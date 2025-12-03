// 


//========================================================



'use client';

import { Control, useController } from 'react-hook-form';
import type { LocationFormValues } from '../LocationsForm';
import styles from './AmenitiesSelector.module.scss';

const AMENITIES = [
  { name: 'amenities.parking',     label: 'Парковка' },
  { name: 'amenities.water',       label: 'Вода' },
  { name: 'amenities.conditioner', label: 'Кондиціонер' },
  { name: 'amenities.shower',      label: 'Душ' },
  { name: 'amenities.wifi',        label: 'WiFi' },
] as const;

type AmenityFieldName =
  | 'amenities.parking'
  | 'amenities.water'
  | 'amenities.conditioner'
  | 'amenities.shower'
  | 'amenities.wifi';

type Props = {
  control: Control<LocationFormValues>;
  labelClassName: string;
};

export default function AmenitiesSelector({ control, labelClassName }: Props) {
  return (
    <div>
      <label className={labelClassName}>Зручності (amenities)</label>

      <div className={styles.amenitiesRow}>
        {AMENITIES.map((a) => {
          const { field } = useController({
            control,
            name: a.name as AmenityFieldName,
          });

          const checked = Boolean(field.value);

          return (
            <label
              key={a.name}
              className={`${styles.chip} ${checked ? styles.chipActive : ''}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <span>{a.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
