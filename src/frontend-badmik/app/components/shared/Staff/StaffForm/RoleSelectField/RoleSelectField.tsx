'use client';

import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form';
import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useRoleListByClub } from '@/services/role/queries.client';
import type { Role } from '@/services/types/role.dto';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;

  clubId?: string | null; // <- важливо, щоб знати по якому клубу грузити ролі

  rootClassName?: string;
  inputClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  optionActiveClassName?: string;
  chevronClassName?: string;

  placeholder?: string;
  requiredMessage?: string;

  disabled?: boolean;
};

export default function RoleSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  clubId,

  rootClassName,
  inputClassName,
  optionsClassName,
  optionClassName,
  optionActiveClassName,
  chevronClassName,

  placeholder = 'Оберіть роль…',
  requiredMessage = 'Оберіть роль.',
  disabled,
}: Props<TFieldValues>) {
  const [query, setQuery] = useState('');
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const enabled = Boolean(clubId) && !disabled;
  const { data } = useRoleListByClub(enabled ? clubId! : undefined);
  const roles: Role[] = data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((r) => (r.name ?? '').toLowerCase().includes(q));
  }, [query, roles]);

  const labelForValue = (roleId?: string | null) => {
    if (!roleId) return '';
    const found = roles.find((r) => r.id === roleId);
    return found?.name ?? '';
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        // якщо хочеш required тільки коли є ролі:
        validate: (v) => {
          if (!enabled) return true; // поки нема clubId — не валідимо
          if (!roles.length) return true; // нема ролей — теж не стопоримо
          return Boolean(v) || requiredMessage;
        },
      }}
      render={({ field, fieldState }) => {
        const value: string | null = (field.value as string) ?? null;
        const isDisabled = disabled || !enabled || roles.length === 0;

        return (
          <div className={rootClassName}>
            <Combobox
              value={value}
              onChange={(v: string | null) => field.onChange(v ?? null)}
              nullable
              disabled={isDisabled}
            >
              <div className="relative">
                <Combobox.Input
                  className={inputClassName}
                  placeholder={!enabled ? 'Спочатку оберіть клуб…' : roles.length ? placeholder : 'Немає ролей'}
                  displayValue={() => labelForValue(value)}
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
                  disabled={isDisabled}
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
                    {enabled && roles.length > 0 && filtered.length === 0 && query !== '' && (
                      <div className={optionClassName}>Нічого не знайдено</div>
                    )}

                    {filtered.map((r) => (
                      <Combobox.Option
                        key={r.id}
                        value={r.id}
                        className={({ active }) => clsx(optionClassName, active && optionActiveClassName)}
                      >
                        <div className="flex justify-between gap-2">
                          <div className="font-semibold">{r.name}</div>
                          {value === r.id && <span aria-hidden>✓</span>}
                        </div>
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>

            {fieldState.error && <p className="mt-1 text-sm text-red-500">{String(fieldState.error.message)}</p>}
          </div>
        );
      }}
    />
  );
}
