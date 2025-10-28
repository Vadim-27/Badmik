

'use client';

import { useEffect } from 'react';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type FieldPathValue,
} from 'react-hook-form';
import styles from './SalaryField.module.scss';

export type SalaryType = 'Hourly' | 'Salary' | 'PerTraining';
export type Currency = 'UAH' | 'USD';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  // Якщо у формі інші назви полів — можна прокинути, але дефолтні працюють "як є"
  salaryTypeName?: Path<TFieldValues>;
  currencyName?: Path<TFieldValues>;
  hourlyRateName?: Path<TFieldValues>;
  monthlySalaryName?: Path<TFieldValues>;
  perTrainingRateName?: Path<TFieldValues>;
};

export default function SalaryField<TFieldValues extends FieldValues>({
  control,
  salaryTypeName,
  currencyName,
  hourlyRateName,
  monthlySalaryName,
  perTrainingRateName,
}: Props<TFieldValues>) {
  // ---- імена полів (за замовчуванням стандартні ключі форми) ----
  const salaryTypePath = (salaryTypeName ?? ('salaryType' as Path<TFieldValues>)) as Path<TFieldValues>;
  const currencyPath = (currencyName ?? ('currency' as Path<TFieldValues>)) as Path<TFieldValues>;
  const hourlyRatePath = (hourlyRateName ?? ('hourlyRate' as Path<TFieldValues>)) as Path<TFieldValues>;
  const monthlySalaryPath = (monthlySalaryName ?? ('monthlySalary' as Path<TFieldValues>)) as Path<TFieldValues>;
  const perTrainingRatePath = (perTrainingRateName ?? ('perTrainingRate' as Path<TFieldValues>)) as Path<TFieldValues>;

  // ---- контролери ----
  const { field: salaryTypeField } = useController<TFieldValues, Path<TFieldValues>>({
    control,
    name: salaryTypePath,
  });

  const { field: currencyField } = useController<TFieldValues, Path<TFieldValues>>({
    control,
    name: currencyPath,
  });

  const hourly = useController<TFieldValues, Path<TFieldValues>>({
    control,
    name: hourlyRatePath,
    rules: {
      validate: (v) =>
        (salaryTypeField.value as SalaryType) !== 'Hourly' || Number(v) >= 0 || 'Ставка не може бути відʼємною.',
    },
  });

  const monthly = useController<TFieldValues, Path<TFieldValues>>({
    control,
    name: monthlySalaryPath,
    rules: {
      validate: (v) =>
        (salaryTypeField.value as SalaryType) !== 'Salary' || Number(v ?? 0) >= 0 || 'Ставка не може бути відʼємною.',
    },
  });

  const perTraining = useController<TFieldValues, Path<TFieldValues>>({
    control,
    name: perTrainingRatePath,
    rules: {
      validate: (v) =>
        (salaryTypeField.value as SalaryType) !== 'PerTraining' ||
        Number(v ?? 0) >= 0 ||
        'Ставка не може бути відʼємною.',
    },
  });

  // ---- синхронізація: активне поле ≥ 0, неактивні → null ----
  useEffect(() => {
    const t = (salaryTypeField.value as SalaryType) ?? 'Hourly';

    if (t === 'Hourly') {
      if (hourly.field.value == null) {
        hourly.field.onChange(0 as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      }
      monthly.field.onChange(null as unknown as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      perTraining.field.onChange(null as unknown as FieldPathValue<TFieldValues, Path<TFieldValues>>);
    } else if (t === 'Salary') {
      if (monthly.field.value == null) {
        monthly.field.onChange(0 as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      }
      hourly.field.onChange(null as unknown as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      perTraining.field.onChange(null as unknown as FieldPathValue<TFieldValues, Path<TFieldValues>>);
    } else {
      // PerTraining
      if (perTraining.field.value == null) {
        perTraining.field.onChange(0 as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      }
      hourly.field.onChange(null as unknown as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      monthly.field.onChange(null as unknown as FieldPathValue<TFieldValues, Path<TFieldValues>>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salaryTypeField.value]);

  // ---- спільний суфікс валюти ----
  const RateSuffix = (
    <div className={styles.suffix}>
      <select
        className={styles.currency}
        value={(currencyField.value as Currency) ?? 'UAH'}
        onChange={(e) =>
          currencyField.onChange(e.target.value as FieldPathValue<TFieldValues, Path<TFieldValues>>)
        }
      >
        <option value="UAH">₴ UAH</option>
        <option value="USD">$ USD</option>
      </select>
    </div>
  );

  // ---- рендер активного інпута ставки ----
  const renderRateInput = () => {
    const t = (salaryTypeField.value as SalaryType) ?? 'Hourly';

    if (t === 'Hourly') {
      return (
        <>
          <label className={styles.label}>Ставка (за годину)</label>
          <div className={styles.inputWithSuffix}>
            <input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              className={`${styles.input} ${styles.inputPadRight} ${
                hourly.fieldState.error ? styles.errorInput : ''
              }`}
              value={(hourly.field.value as number | null | undefined) ?? 0}
              onChange={(e) =>
                hourly.field.onChange(
                  (e.target.value === '' ? 0 : Number(e.target.value)) as FieldPathValue<
                    TFieldValues,
                    Path<TFieldValues>
                  >
                )
              }
            />
            {RateSuffix}
          </div>
          {hourly.fieldState.error && (
            <p className={styles.errorText}>{String(hourly.fieldState.error.message)}</p>
          )}
        </>
      );
    }

    if (t === 'Salary') {
      return (
        <>
          <label className={styles.label}>Місячна зарплата</label>
          <div className={styles.inputWithSuffix}>
            <input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              className={`${styles.input} ${styles.inputPadRight} ${
                monthly.fieldState.error ? styles.errorInput : ''
              }`}
              value={(monthly.field.value as number | null | undefined) ?? 0}
              onChange={(e) =>
                monthly.field.onChange(
                  (e.target.value === '' ? 0 : Number(e.target.value)) as FieldPathValue<
                    TFieldValues,
                    Path<TFieldValues>
                  >
                )
              }
            />
            {RateSuffix}
          </div>
          {monthly.fieldState.error && (
            <p className={styles.errorText}>{String(monthly.fieldState.error.message)}</p>
          )}
        </>
      );
    }

    // PerTraining
    return (
      <>
        <label className={styles.label}>Ставка (за тренування)</label>
        <div className={styles.inputWithSuffix}>
          <input
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            className={`${styles.input} ${styles.inputPadRight} ${
              perTraining.fieldState.error ? styles.errorInput : ''
            }`}
            value={(perTraining.field.value as number | null | undefined) ?? 0}
            onChange={(e) =>
              perTraining.field.onChange(
                (e.target.value === '' ? 0 : Number(e.target.value)) as FieldPathValue<
                  TFieldValues,
                  Path<TFieldValues>
                >
              )
            }
          />
          {RateSuffix}
        </div>
        {perTraining.fieldState.error && (
          <p className={styles.errorText}>{String(perTraining.fieldState.error.message)}</p>
        )}
      </>
    );
  };

  return (
    <div className={styles.salaryBlock}>
      <div>
        <label className={styles.label}>Тип оплати</label>

        {/* чипи-радіо */}
        <div className={styles.chipsRow} role="radiogroup" aria-label="Тип оплати">
          {[
            { value: 'Hourly' as SalaryType, label: 'Погодинна' },
            { value: 'Salary' as SalaryType, label: 'Місячна' },
            { value: 'PerTraining' as SalaryType, label: 'За тренування' },
          ].map((opt) => {
            const active = (salaryTypeField.value as SalaryType) === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                onClick={() =>
                  salaryTypeField.onChange(
                    opt.value as FieldPathValue<TFieldValues, Path<TFieldValues>>
                  )
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>{renderRateInput()}</div>
    </div>
  );
}
