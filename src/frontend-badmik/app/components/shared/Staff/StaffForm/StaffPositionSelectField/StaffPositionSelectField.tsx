'use client';

import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form';
import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

export type StaffPositionType = 'Trainer' | 'Manager' | 'Administrator' | 'Accountant';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;

  rootClassName?: string;
  inputClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  optionActiveClassName?: string;
  chevronClassName?: string;

  placeholder?: string;
  requiredMessage?: string;
};

const OPTIONS: { value: StaffPositionType; label: string }[] = [
  { value: 'Trainer', label: 'Тренер' },
  { value: 'Manager', label: 'Менеджер' },
  { value: 'Administrator', label: 'Адміністратор' },
  { value: 'Accountant', label: 'Бухгалтер' },
];

export default function StaffPositionSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  rootClassName,
  inputClassName,
  optionsClassName,
  optionClassName,
  optionActiveClassName,
  chevronClassName,
  placeholder = 'Оберіть посаду…',
  requiredMessage = 'Оберіть посаду.',
}: Props<TFieldValues>) {
  const [query, setQuery] = useState('');
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return OPTIONS;
    return OPTIONS.filter((o) => o.label.toLowerCase().includes(q));
  }, [query]);

  const labelForValue = (v?: string | null) => {
    const found = OPTIONS.find((o) => o.value === v);
    return found?.label ?? '';
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: requiredMessage }}
      render={({ field, fieldState }) => {
        const value: StaffPositionType | null = (field.value as StaffPositionType) ?? null;

        return (
          <div className={rootClassName}>
            <Combobox value={value} onChange={(v: StaffPositionType | null) => field.onChange(v ?? null)} nullable>
              <div className="relative">
                <Combobox.Input
                  className={inputClassName}
                  placeholder={placeholder}
                  displayValue={(v: StaffPositionType) => labelForValue(v)}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={field.onBlur}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="search"
                  name={`${String(name)}-display`}
                  onFocus={() => btnRef.current?.click()}
                />

                <Combobox.Button
                  ref={btnRef}
                  type="button"
                  className={chevronClassName}
                  aria-label="Toggle options"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M7 10l5 5 5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Combobox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery('')}
                >
                  <Combobox.Options className={optionsClassName}>
                    {filtered.length === 0 && query !== '' && (
                      <div className={optionClassName}>Нічого не знайдено</div>
                    )}

                    {filtered.map((opt) => (
                      <Combobox.Option
                        key={opt.value}
                        value={opt.value}
                        className={({ active }) => clsx(optionClassName, active && optionActiveClassName)}
                      >
                        <div className="flex justify-between gap-2">
                          <div className="font-semibold">{opt.label}</div>
                          {value === opt.value && <span aria-hidden>✓</span>}
                        </div>
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>

            {fieldState.error && <p className="mt-1 text-sm text-red-500">{fieldState.error.message}</p>}
          </div>
        );
      }}
    />
  );
}
