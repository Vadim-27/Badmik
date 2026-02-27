'use client';

import styles from './SettingNumberField.module.scss';

type Props = {
  id: string;
  title: string;
  hint: string;
  rightLabel: string;

  value: number;

  min?: number;
  max?: number;
  step?: number;

  example?: string;

  onChange: (value: number) => void;
};

export default function SettingNumberField({
  id,
  title,
  hint,
  rightLabel,
  value,
  min,
  max,
  step,
  example,
  onChange,
}: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <label htmlFor={id} className={styles.label}>
          {title}
        </label>
        <p className={styles.hint}>{hint}</p>
      </div>

      <div className={styles.right}>
        <div className={styles.inputRow}>
          <input
            id={id}
            name={id}
            type="number"
            className={styles.input}
            value={Number.isFinite(value) ? value : 0}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
          />
          <span className={styles.unit}>{rightLabel}</span>
        </div>

        {!!example && <p className={styles.example}>{example}</p>}
      </div>
    </div>
  );
}
