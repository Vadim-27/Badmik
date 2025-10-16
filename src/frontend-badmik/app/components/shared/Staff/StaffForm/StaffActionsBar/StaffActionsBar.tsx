// 'use client';

// import { Popover, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
// import { useController, type Control } from 'react-hook-form';
// import styles from './StaffActionsBar.module.scss';
// import clsx from 'clsx';

// type Props<T> = {
//   control: Control<T>;
//   onManageRoles?: () => void;
// };

// const STATUSES: Array<{ value: 'New' | 'Active' | 'Disabled' | 'Deleted'; label: string }> = [
//   { value: 'New',      label: 'New' },
//   { value: 'Active',   label: 'Active' },
//   { value: 'Disabled', label: 'Disabled' },
//   { value: 'Deleted',  label: 'Deleted' },
// ];

// export default function StaffActionsBar<T>({ control, onManageRoles }: Props<T>) {
//   const { field: statusField } = useController({
//     control,
//     name: 'staffStatus' as any,
//     defaultValue: 'New' as any,
//   });

//   return (
//     <div className={styles.actionsBar}>
//       <button
//         type="button"
//         className={clsx(styles.button, styles.buttonGhost)}
//         onClick={onManageRoles}
//       >
//         Керувати ролями
//       </button>

//       <Popover className={styles.popoverRoot}>
//         <Popover.Button className={clsx(styles.button, styles.buttonGhost)}>
//           Активність
//         </Popover.Button>

//         <Transition
//           as={Fragment}
//           enter="transition ease-out duration-100"
//           enterFrom="opacity-0 translate-y-1"
//           enterTo="opacity-100 translate-y-0"
//           leave="transition ease-in duration-75"
//           leaveFrom="opacity-100 translate-y-0"
//           leaveTo="opacity-0 translate-y-1"
//         >
//           <Popover.Panel className={styles.popoverPanel}>
//             {({ close }) => (
//               <div className={styles.chipsRow} role="listbox" aria-label="Статус співробітника">
//                 {STATUSES.map((opt) => {
//                   const active = statusField.value === opt.value;
//                   return (
//                     <button
//                       key={opt.value}
//                       type="button"
//                       role="option"
//                       aria-selected={active}
//                       className={clsx(styles.chip, active && styles.chipActive)}
//                       onClick={() => {
//                         statusField.onChange(opt.value);
//                         close(); // закриваємо після вибору
//                       }}
//                     >
//                       {opt.label}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </Popover.Panel>
//         </Transition>
//       </Popover>
//     </div>
//   );
// }


//================================================================================


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

type StaffStatus = 'New' | 'Active' | 'Disabled' | 'Deleted';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  /** Ім'я поля у формі; за замовчуванням 'staffStatus' */
  name?: Path<TFieldValues>;
  onRolesClick?: () => void;
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
  onRolesClick,
}: Props<TFieldValues>) {
  // ім'я поля (можна не передавати — тоді staffStatus)
  const fieldName = (name ?? ('staffStatus' as Path<TFieldValues>)) as Path<TFieldValues>;

  // контролюємо поле без defaultValue (бере з useForm.defaultValues)
  const { field: statusField } = useController<TFieldValues, Path<TFieldValues>>({
    control,
    name: fieldName,
  });

  // значення для підсвітки у поповері (якщо порожнє — вважаємо New)
  const current: StaffStatus =
    (typeof statusField.value === 'string' ? (statusField.value as StaffStatus) : 'New');

  return (
    <div className={styles.actionsBar}>
      <button
        type="button"
        className={clsx(styles.button, styles.buttonGhost)}
        onClick={onRolesClick}
      >
        Керувати ролями
      </button>

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
                  const active = current === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={clsx(styles.chip, active && styles.chipActive)}
                      onClick={() => {
                        // запишемо у форму; типобезпечно без any
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
