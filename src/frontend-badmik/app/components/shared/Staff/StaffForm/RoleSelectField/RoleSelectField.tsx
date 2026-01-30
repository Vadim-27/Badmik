// 'use client';

// import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form';
// import { Combobox, Transition } from '@headlessui/react';
// import { Fragment, useMemo, useRef, useState } from 'react';
// import clsx from 'clsx';

// import { useRoleListByClub } from '@/services/role/queries.client';
// import type { Role } from '@/services/types/role.dto';
// import { useTranslations } from 'next-intl';

// type Props<TFieldValues extends FieldValues> = {
//   control: Control<TFieldValues>;
//   name: FieldPath<TFieldValues>;

//   clubId?: string | null; // <- важливо, щоб знати по якому клубу грузити ролі

//   rootClassName?: string;
//   inputClassName?: string;
//   optionsClassName?: string;
//   optionClassName?: string;
//   optionActiveClassName?: string;
//   chevronClassName?: string;

//   placeholder?: string;
//   requiredMessage?: string;

//   disabled?: boolean;
// };

// export default function RoleSelectField<TFieldValues extends FieldValues>({
//   control,
//   name,
//   clubId,

//   rootClassName,
//   inputClassName,
//   optionsClassName,
//   optionClassName,
//   optionActiveClassName,
//   chevronClassName,

//   placeholder = 'Оберіть роль…',
//   requiredMessage = 'Оберіть роль.',
//   disabled,
// }: Props<TFieldValues>) {
//   const tR = useTranslations('RoleFormSelectField');
//   const [query, setQuery] = useState('');
//   const btnRef = useRef<HTMLButtonElement | null>(null);

//   const enabled = Boolean(clubId) && !disabled;
//   const { data } = useRoleListByClub(enabled ? clubId! : undefined);
//   const roles: Role[] = data ?? [];
//   console.log('RoleSelectField render', { clubId, roles });

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return roles;
//     return roles.filter((r) => (r.name ?? '').toLowerCase().includes(q));
//   }, [query, roles]);

//    console.log('RoleSe', filtered);
//   const labelForValue = (roleId?: string | null) => {
//   if (!roleId) return '';
//   const found = roles.find((r) => r.id === roleId);
//   if (!found?.name) return '';
//   return tR(found.name); 
// };

//   console.log('Role name', labelForValue());

//   return (
//     <Controller
//       control={control}
//       name={name}
//      rules={{
//   validate: (v) => {
//     if (!enabled) return true;
//     if (!v) return true; // ✅ пусте значення дозволяємо
//     return roles.some((r) => r.id === v) || 'Невірна роль';
//   },
// }}
//       render={({ field, fieldState }) => {
//         const value: string | null = (field.value as string) ?? null;
//         const isDisabled = disabled || !enabled || roles.length === 0;

//         return (
//           <div className={rootClassName}>
//             <Combobox
//               value={value}
//               onChange={(v: string | null) => field.onChange(v ?? null)}
//               nullable
//               disabled={isDisabled}
//             >
//               <div className="relative">
//                 <Combobox.Input
//                   className={inputClassName}
//                   placeholder={!enabled ? 'Спочатку оберіть клуб…' : roles.length ? placeholder : 'Немає ролей'}
//                   displayValue={() => labelForValue(value)}
//                   onChange={(e) => setQuery(e.target.value)}
//                   onBlur={field.onBlur}
//                   autoComplete="off"
//                   autoCorrect="off"
//                   spellCheck={false}
//                   inputMode="search"
//                   name={`${String(name)}-display`}
//                   onFocus={() => btnRef.current?.click()}
//                 />

//                 <Combobox.Button
//                   ref={btnRef}
//                   type="button"
//                   className={chevronClassName}
//                   aria-label="Toggle options"
//                   disabled={isDisabled}
//                 >
//                   <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
//                     <path
//                       d="M7 10l5 5 5-5"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </Combobox.Button>

//                 <Transition
//                   as={Fragment}
//                   leave="transition ease-in duration-100"
//                   leaveFrom="opacity-100"
//                   leaveTo="opacity-0"
//                   afterLeave={() => setQuery('')}
//                 >
//                   <Combobox.Options className={optionsClassName}>
//                     {enabled && roles.length > 0 && filtered.length === 0 && query !== '' && (
//                       <div className={optionClassName}>Нічого не знайдено</div>
//                     )}

//                     {filtered.map((r) => (
//                       <Combobox.Option
//                         key={r.id}
//                         value={r.id}
//                         className={({ active }) => clsx(optionClassName, active && optionActiveClassName)}
//                       >
//                         <div className="flex justify-between gap-2">
//                           <div className="font-semibold">{tR(r.name)}</div>
//                           {value === r.id && <span aria-hidden>✓</span>}
//                         </div>
//                       </Combobox.Option>
//                     ))}
//                   </Combobox.Options>
//                 </Transition>
//               </div>
//             </Combobox>

//             {fieldState.error && <p className="mt-1 text-sm text-red-500">{String(fieldState.error.message)}</p>}
//           </div>
//         );
//       }}
//     />
//   );
// }


//=============================

'use client';

import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form';
import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useRoleListByClub } from '@/services/role/queries.client';
import type { Role } from '@/services/types/role.dto';
import { useTranslations } from 'next-intl';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;

  clubId?: string | null;

  rootClassName?: string;
  inputClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  optionActiveClassName?: string;
  chevronClassName?: string;

  placeholder?: string;
  requiredMessage?: string;

  disabled?: boolean;

  /** якщо не можна дивитися/міняти роль конкретного staff (403 на /staff/{id}/roles) */
  staffRoleForbidden?: boolean;
};

function getStatus(err: any): number | null {
  return err?.response?.status ?? err?.status ?? null;
}
function getMessage(err: any): string | null {
  return err?.response?.data?.message ?? err?.data?.message ?? err?.message ?? null;
}

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

  staffRoleForbidden,
}: Props<TFieldValues>) {
  const tR = useTranslations('RoleFormSelectField');

  const [query, setQuery] = useState('');
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // якщо 403 по staff roles — ми блокуємо зміну ролі взагалі (навіть якщо ролі клубу доступні)
  const enabled = Boolean(clubId) && !disabled && !staffRoleForbidden;

  const rolesQuery = useRoleListByClub(enabled ? clubId! : undefined);
  const rolesStatus = getStatus(rolesQuery.error);
  const rolesForbidden = rolesStatus === 403;

  const roles: Role[] = rolesQuery.data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((r) => (r.name ?? '').toLowerCase().includes(q));
  }, [query, roles]);

  const labelForValue = (roleId?: string | null) => {
    if (!roleId) return '';
    const found = roles.find((r) => r.id === roleId);
    if (!found?.name) return '';
    return tR(found.name);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (v) => {
          // якщо поле вимкнене або прав нема — не валідую
          if (!enabled || rolesForbidden) return true;

          // пусте значення дозволяємо
          if (!v) return true;

          return roles.some((r) => r.id === v) || 'Невірна роль';
        },
      }}
      render={({ field, fieldState }) => {
        const value: string | null = (field.value as string) ?? null;

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
              onChange={(v: string | null) => field.onChange(v ?? null)}
              nullable
              disabled={isDisabled}
            >
              <div className="relative">
                <Combobox.Input
                  className={inputClassName}
                  placeholder={inputPlaceholder}
                  displayValue={() => labelForValue(value)}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={field.onBlur}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="search"
                  name={`${String(name)}-display`}
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
                          className={({ active }) =>
                            clsx(optionClassName, active && optionActiveClassName)
                          }
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

            {/* пріоритетно показуємо permission-меседжі */}
            {staffRoleForbidden && (
              <p className="mt-1 text-sm text-red-500">У вас нема прав доступу для зміни ролі</p>
            )}

            {!staffRoleForbidden && rolesForbidden && (
              <p className="mt-1 text-sm text-red-500">
                {getMessage(rolesQuery.error) ?? 'У вас нема прав переглядати ролі клубу'}
              </p>
            )}

            {!staffRoleForbidden && !rolesForbidden && fieldState.error && (
              <p className="mt-1 text-sm text-red-500">{String(fieldState.error.message)}</p>
            )}
          </div>
        );
      }}
    />
  );
}
