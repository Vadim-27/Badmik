

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
  // ---- дефолтні імена полів ----
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
        (salaryTypeField.value as SalaryType) !== 'Hourly' ||
        v === '' ||
        Number(v) >= 0 ||
        'Ставка не може бути відʼємною.',
    },
  });

  const monthly = useController<TFieldValues, Path<TFieldValues>>({
    control,
    name: monthlySalaryPath,
    rules: {
      validate: (v) =>
        (salaryTypeField.value as SalaryType) !== 'Salary' ||
        v === '' ||
        Number(v) >= 0 ||
        'Ставка не може бути відʼємною.',
    },
  });

  const perTraining = useController<TFieldValues, Path<TFieldValues>>({
    control,
    name: perTrainingRatePath,
    rules: {
      validate: (v) =>
        (salaryTypeField.value as SalaryType) !== 'PerTraining' ||
        v === '' ||
        Number(v) >= 0 ||
        'Ставка не може бути відʼємною.',
    },
  });

  // ---- при зміні типу ставки очищаємо неактивні поля ----
  useEffect(() => {
    const type = (salaryTypeField.value as SalaryType) ?? 'Hourly';

    if (type === 'Hourly') {
      if (hourly.field.value == null) hourly.field.onChange('' as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      monthly.field.onChange(null as unknown as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      perTraining.field.onChange(null as unknown as FieldPathValue<TFieldValues, Path<TFieldValues>>);
    } else if (type === 'Salary') {
      if (monthly.field.value == null) monthly.field.onChange('' as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      hourly.field.onChange(null as unknown as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      perTraining.field.onChange(null as unknown as FieldPathValue<TFieldValues, Path<TFieldValues>>);
    } else {
      if (perTraining.field.value == null)
        perTraining.field.onChange('' as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      hourly.field.onChange(null as unknown as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      monthly.field.onChange(null as unknown as FieldPathValue<TFieldValues, Path<TFieldValues>>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salaryTypeField.value]);

  // ---- випадаючий список валюти ----
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

  // ---- санітизація вводу: ≥0, без провідних нулів, кома → крапка, ".5" → "0.5" ----
  const handleRateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: FieldPathValue<TFieldValues, Path<TFieldValues>>) => void
  ) => {
    let str = e.target.value;

    // порожнє поле дозволяємо (щоб не показувати 0)
    if (str === '') {
      onChange('' as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      return;
    }

    // локальний ввід з комою
    str = str.replace(',', '.').trim();

    // якщо користувач ввів ".5" → "0.5"
    if (str.startsWith('.')) str = '0' + str;

    // забороняємо провідні нулі для цілої частини: "0123" → "123", "00.5" → "0.5"
    if (/^0\d+/.test(str) && !str.startsWith('0.')) {
      str = str.replace(/^0+/, '');
      if (str === '') str = '0';
    }
    // нормалізація "000.5" → "0.5"
    if (/^0+\./.test(str)) {
      str = str.replace(/^0+/, '0');
    }

    // парсимо та клампимо
    const num = Number(str);
    if (!Number.isFinite(num)) {
      onChange('' as FieldPathValue<TFieldValues, Path<TFieldValues>>);
      return;
    }
    const clamped = Math.max(0, num);

    onChange(clamped as FieldPathValue<TFieldValues, Path<TFieldValues>>);
  };

  // ---- рендер активного інпута ставки ----
  const renderRateInput = () => {
    const type = (salaryTypeField.value as SalaryType) ?? 'Hourly';

    if (type === 'Hourly') {
      return (
        <>
          <label className={styles.label}>Ставка (за годину)</label>
          <div className={styles.inputWithSuffix}>
            <input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              placeholder="0"
              className={`${styles.input} ${styles.inputPadRight} ${
                hourly.fieldState.error ? styles.errorInput : ''
              }`}
              value={(hourly.field.value as number | string | null | undefined) ?? ''}
              onChange={(e) => handleRateChange(e, hourly.field.onChange)}
            />
            {RateSuffix}
          </div>
          {hourly.fieldState.error && <p className={styles.errorText}>{String(hourly.fieldState.error.message)}</p>}
        </>
      );
    }

    if (type === 'Salary') {
      return (
        <>
          <label className={styles.label}>Місячна зарплата</label>
          <div className={styles.inputWithSuffix}>
            <input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              placeholder="0"
              className={`${styles.input} ${styles.inputPadRight} ${
                monthly.fieldState.error ? styles.errorInput : ''
              }`}
              value={(monthly.field.value as number | string | null | undefined) ?? ''}
              onChange={(e) => handleRateChange(e, monthly.field.onChange)}
            />
            {RateSuffix}
          </div>
          {monthly.fieldState.error && <p className={styles.errorText}>{String(monthly.fieldState.error.message)}</p>}
        </>
      );
    }

    return (
      <>
        <label className={styles.label}>Ставка (за тренування)</label>
        <div className={styles.inputWithSuffix}>
          <input
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            placeholder="0"
            className={`${styles.input} ${styles.inputPadRight} ${
              perTraining.fieldState.error ? styles.errorInput : ''
            }`}
            value={(perTraining.field.value as number | string | null | undefined) ?? ''}
            onChange={(e) => handleRateChange(e, perTraining.field.onChange)}
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
                  salaryTypeField.onChange(opt.value as FieldPathValue<TFieldValues, Path<TFieldValues>>)
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
