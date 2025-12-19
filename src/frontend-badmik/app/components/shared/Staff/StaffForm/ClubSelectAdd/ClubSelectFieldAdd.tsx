'use client';

import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form';
import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useMemo, useState, useCallback, useRef } from 'react';
// import { useClubs } from '@/features/clubs/hooks/useClubs';
import { useClubsList } from '@/services/clubs/queries.client';
import type { Club } from '@/services/types/clubs.dto';
import clsx from 'clsx';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;   // ✔ коректний тип для ключа форми

  rootClassName?: string;
  inputClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  optionActiveClassName?: string;
  chevronClassName?: string;

  renderOption?: (club: Club) => React.ReactNode;
  placeholder?: string;
};

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export default function ClubSelectFieldAdd<TFieldValues extends FieldValues>({
  control,
  name,
  rootClassName,
  inputClassName,
  optionsClassName,
  optionClassName,
  optionActiveClassName,
  chevronClassName,
  renderOption,
  placeholder = 'Пошук клубу за назвою або адресою',
}: Props<TFieldValues>) {
  // const { data, isLoading, error } = useClubs();
   const { data, isLoading, error } = useClubsList();
  const [query, setQuery] = useState('');
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // нормалізуємо у масив
  const clubs: Club[] = useMemo(() => {
    if (Array.isArray(data)) return data as Club[];
    if (data && Array.isArray((data as any).result)) return (data as any).result as Club[];
    return [];
  }, [data]);

  const byId = useMemo(() => {
    const m = new Map<string, Club>();
    for (const c of clubs) m.set(c.id, c);
    return m;
  }, [clubs]);

  const labelForId = useCallback((id?: string | null) => {
    if (!id) return '';
    const c = byId.get(id);
    return c ? `${c.name} — ${c.address ?? ''}`.trim() : '';
  }, [byId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clubs;
    return clubs.filter(
      (c) =>
        (c.name ?? '').toLowerCase().includes(q) ||
        (c.address ?? '').toLowerCase().includes(q)
    );
  }, [clubs, query]);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: 'Потрібно обрати клуб.',   // ✔ нове повідомлення
        pattern: { value: uuidRegex, message: 'Некоректний UUID' },
      }}
      render={({ field, fieldState }) => {
        const value: string | null = (field.value as string) ?? null;

        return (
          <div className={rootClassName}>
            <Combobox value={value} onChange={(id: string | null) => field.onChange(id ?? '')} nullable>
              <div className="relative">
                <Combobox.Input
                  className={inputClassName}
                  placeholder={placeholder}
                  displayValue={(id: string) => labelForId(id)}
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
                    <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                    {isLoading && <div className={optionClassName}>Завантаження…</div>}
                    {!!error && !isLoading && <div className={optionClassName}>Помилка завантаження</div>}

                    {!isLoading && !error && filtered.length === 0 && query !== '' && (
                      <div className={optionClassName}>Нічого не знайдено</div>
                    )}

                    {!isLoading && !error && filtered.map((c) => (
                      <Combobox.Option
                        key={c.id}
                        value={c.id}
                        className={({ active }) => clsx(optionClassName, active && optionActiveClassName)}
                      >
                        {renderOption ? (
                          renderOption(c)
                        ) : (
                          <div className="flex justify-between gap-2">
                            <div>
                              <div className="font-semibold">{c.name}</div>
                              <div className="text-sm opacity-80">{c.address}</div>
                            </div>
                            {value === c.id && <span aria-hidden>✓</span>}
                          </div>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>

            {fieldState.error && (
              <p className="mt-1 text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}


