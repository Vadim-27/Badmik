'use client';

import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { useRoleListByClub } from '@/services/role/queries.client';
import type { Role } from '@/services/types/role.dto';

type Props = {
  value: string | null;
  onChange: (v: string | null) => void;

  clubId?: string | null;
  disabled?: boolean;
  staffRoleForbidden?: boolean;

  rootClassName?: string;
  inputClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  optionActiveClassName?: string;
  chevronClassName?: string;

  placeholder?: string;
};

function getStatus(err: any): number | null {
  return err?.response?.status ?? err?.status ?? null;
}

function getMessage(err: any): string | null {
  return err?.response?.data?.message ?? err?.data?.message ?? err?.message ?? null;
}

export default function RoleSelect({
  value,
  onChange,
  clubId,
  disabled,
  staffRoleForbidden,

  rootClassName,
  inputClassName,
  optionsClassName,
  optionClassName,
  optionActiveClassName,
  chevronClassName,

  placeholder = 'Оберіть роль…',
}: Props) {
  const tR = useTranslations('RoleFormSelectField');

  const [query, setQuery] = useState('');
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const enabled = Boolean(clubId) && !disabled && !staffRoleForbidden;

  const rolesQuery = useRoleListByClub(enabled ? clubId! : undefined);
  const rolesForbidden = getStatus(rolesQuery.error) === 403;

  const roles: Role[] = rolesQuery.data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((r) => (r.name ?? '').toLowerCase().includes(q));
  }, [query, roles]);

  const labelForValue = (roleId?: string | null) => {
    if (!roleId) return '';
    const found = roles.find((r) => r.id === roleId);
    return found?.name ? tR(found.name) : '';
  };

  const isDisabled =
    Boolean(disabled) ||
    !clubId ||
    staffRoleForbidden ||
    rolesForbidden ||
    rolesQuery.isLoading;

  const inputPlaceholder = staffRoleForbidden
    ? 'У вас нема прав доступу для зміни ролі'
    : !clubId
      ? 'Спочатку оберіть клуб…'
      : rolesForbidden
        ? (getMessage(rolesQuery.error) ?? 'У вас нема прав переглядати ролі клубу')
        : rolesQuery.isLoading
          ? 'Завантаження ролей…'
          : roles.length
            ? placeholder
            : 'Немає ролей';

  return (
    <div className={rootClassName}>
      <Combobox
        value={value}
        onChange={(v: string | null) => onChange(v ?? null)}
        nullable
        disabled={isDisabled}
      >
        <div className="relative">
          <Combobox.Input
            className={inputClassName}
            placeholder={inputPlaceholder}
            displayValue={() => labelForValue(value)}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="search"
            onFocus={() => {
              if (!isDisabled) btnRef.current?.click();
            }}
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
              {enabled && !rolesForbidden && roles.length > 0 && filtered.length === 0 && query !== '' && (
                <div className={optionClassName}>Нічого не знайдено</div>
              )}

              {!rolesForbidden &&
                filtered.map((r) => (
                  <Combobox.Option
                    key={r.id}
                    value={r.id}
                    className={({ active }) => clsx(optionClassName, active && optionActiveClassName)}
                  >
                    <div className="flex justify-between gap-2">
                      <div className="font-semibold">{tR(r.name)}</div>
                      {value === r.id && <span aria-hidden>✓</span>}
                    </div>
                  </Combobox.Option>
                ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
