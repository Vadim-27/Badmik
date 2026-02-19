'use client';

import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import type { ClubMembershipPlan } from '@/services/types/clubMembershipPlans.dto';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;

  plans: ClubMembershipPlan[];

  rootClassName?: string;
  inputClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  optionActiveClassName?: string;
  chevronClassName?: string;

  disabled?: boolean;

  placeholder: string;
  requiredMessage?: string;

  labelForPlan: (p: ClubMembershipPlan) => string;
  emptyText?: string;
};

type Pos = { top: number; left: number; width: number };

export default function PlanSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  plans,
  rootClassName,
  inputClassName,
  optionsClassName,
  optionClassName,
  optionActiveClassName,
  chevronClassName,
  disabled,
  placeholder,
  requiredMessage,
  labelForPlan,
  emptyText = 'Нічого не знайдено',
}: Props<TFieldValues>) {
  const [query, setQuery] = useState('');
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pos, setPos] = useState<Pos | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plans;
    return plans.filter((p) => labelForPlan(p).toLowerCase().includes(q));
  }, [query, plans, labelForPlan]);

  const updatePos = () => {
    const el = inputRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + 6, left: r.left, width: r.width });
  };

  useEffect(() => {
    const onScroll = () => updatePos();
    const onResize = () => updatePos();

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      rules={requiredMessage ? { required: requiredMessage } : undefined}
      render={({ field }) => {
        const selectedId = String(field.value ?? '');
        const selectedPlan = plans.find((p) => String(p.id) === selectedId) ?? null;

        return (
          <div className={rootClassName}>
            <Combobox
              value={selectedPlan}
              onChange={(p: ClubMembershipPlan | null) => field.onChange(p ? String(p.id) : '')}
              disabled={Boolean(disabled)}
              nullable
            >
              <div className="relative">
                <Combobox.Input
                  ref={inputRef}
                  className={inputClassName}
                  placeholder={placeholder}
                  displayValue={(p: ClubMembershipPlan) => (p ? labelForPlan(p) : '')}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={field.onBlur}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="search"
                  name={`${String(name)}-display`}
                  onFocus={() => {
                    updatePos();
                    btnRef.current?.click();
                  }}
                  onClick={() => updatePos()}
                />

                <Combobox.Button
                  ref={btnRef}
                  type="button"
                  className={chevronClassName}
                  aria-label="Toggle options"
                  onClick={() => updatePos()}
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
                  <Combobox.Options
                    className={optionsClassName}
                    style={
                      pos
                        ? {
                            position: 'fixed',
                            top: pos.top,
                            left: pos.left,
                            width: pos.width,
                            zIndex: 999999,
                          }
                        : undefined
                    }
                  >
                    {filtered.length === 0 && query !== '' ? (
                      <div className={optionClassName}>{emptyText}</div>
                    ) : null}

                    {filtered.map((p) => (
                      <Combobox.Option
                        key={String(p.id)}
                        value={p}
                        className={({ active }) => clsx(optionClassName, active && optionActiveClassName)}
                      >
                        <div className="flex justify-between gap-2">
                          <div className="font-semibold">{labelForPlan(p)}</div>
                          {String(p.id) === selectedId ? <span aria-hidden>✓</span> : null}
                        </div>
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
        );
      }}
    />
  );
}
