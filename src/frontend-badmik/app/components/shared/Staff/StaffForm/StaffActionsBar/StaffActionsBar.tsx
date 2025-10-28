

'use client';



import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type FieldPathValue,
} from 'react-hook-form';
import styles from './StaffActionsBar.module.scss';
import clsx from 'clsx';
import { useRoleList } from '@/services/role/queries.client';

type StaffStatus = 'New' | 'Active' | 'Disabled' | 'Deleted';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  
  name?: Path<TFieldValues>;

  showRolesButton?: boolean;

  roleFieldName?: Path<TFieldValues>;
};

const STATUSES: ReadonlyArray<{ value: StaffStatus; label: string }> = [
  { value: 'New', label: 'New' },
  { value: 'Active', label: 'Active' },
  { value: 'Disabled', label: 'Disabled' },
  { value: 'Deleted', label: 'Deleted' },
];

export default function StaffActionsBar<TFieldValues extends FieldValues>({
  control,
  name,
  showRolesButton = false,
  roleFieldName,
}: Props<TFieldValues>) {

  const rolesQuery = useRoleList();


  const statusName = (name ?? ('staffStatus' as Path<TFieldValues>)) as Path<TFieldValues>;
  const { field: statusField } = useController<TFieldValues, Path<TFieldValues>>({
    control,
    name: statusName,
  });
  const currentStatus: StaffStatus =
    (typeof statusField.value === 'string' ? (statusField.value as StaffStatus) : 'New');



    const roleName = (roleFieldName ?? ('roleId' as Path<TFieldValues>)) as Path<TFieldValues>;
  const { field: roleField } = useController({ control, name: roleName });
  const currentRoleId = roleField.value as string | null;

  const roles = rolesQuery.data ?? [];

 

  return (
    <div className={styles.actionsBar}>
      {/* ==== Поповер ролей (тільки в edit) ==== */}
      {showRolesButton && (
        <Popover className={styles.popoverRoot}>
          <Popover.Button className={clsx(styles.button, styles.buttonGhost)}>Ролі</Popover.Button>
          <Transition as={Fragment} enter="ease-out duration-100" leave="ease-in duration-75">
            <Popover.Panel className={styles.popoverPanel}>
              {({ close }) => (
                <div className={styles.chipsRow}>
                  {roles.map((r) => {
                    const active = currentRoleId === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        className={clsx(styles.chip, active && styles.chipActive)}
                        onClick={() => {
                          roleField.onChange(
                            r.id as FieldPathValue<TFieldValues, Path<TFieldValues>>
                          );
                          close();
                        }}
                      >
                        {r.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </Popover.Panel>
          </Transition>
        </Popover>
      )}

      {/* ==== Поповер статусів — як було ==== */}
      <Popover className={styles.popoverRoot}>
        <Popover.Button className={clsx(styles.button, styles.buttonGhost)}>
          Активність
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className={styles.popoverPanel}>
            {({ close }) => (
              <div className={styles.chipsRow} role="listbox" aria-label="Статус співробітника">
                {STATUSES.map((opt) => {
                  const active = currentStatus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={clsx(styles.chip, active && styles.chipActive)}
                      onClick={() => {
                        statusField.onChange(
                          opt.value as FieldPathValue<TFieldValues, Path<TFieldValues>>
                        );
                        close();
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
}
