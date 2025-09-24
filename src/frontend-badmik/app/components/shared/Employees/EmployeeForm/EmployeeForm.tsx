// 'use client';

// import * as React from 'react';
// import { useEffect } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import styles from './EmployeeForm.module.scss';

// type Role = 'owner_admin' | 'assistant' | 'club_admin';
// type Permission = 'all' | 'view_users' | 'club_dashboard' | 'manage_bookings';

// const ALL_PERMISSIONS: Permission[] = [
//   'all',
//   'view_users',
//   'club_dashboard',
//   'manage_bookings',
// ];

// type FormValues = {
//   email: string;
//   password?: string;
//   role: Role;
//   clubId?: string;
//   permissions: Permission[];
// };

// type Props = {
//   mode: 'create' | 'edit';
//   adminId?: string;
//   defaultValues?: Partial<FormValues>;
//   onSubmitCreate?: (data: FormValues) => Promise<void>;
//   onSubmitUpdate?: (adminId: string, data: FormValues) => Promise<void>;
//   // додано: функція для повідомлення батька, що форма змінилася
//   isChanged?: boolean;
//   setIsChanged?: (v: boolean) => void;
// };

// export default function EmployeeForm({
//   mode,
//   adminId,
//   defaultValues,
//   onSubmitCreate,
//   onSubmitUpdate,
//   isChanged,
//   setIsChanged,
// }: Props) {
//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     watch,
//     formState: { errors, isSubmitting, isDirty, isValid },
//   } = useForm<FormValues>({
//     mode: 'all',
//     defaultValues: {
//       email: '',
//       password: '',
//       role: 'assistant',
//       clubId: '',
//       permissions: [],
//       ...defaultValues,
//     },
//   });

//   const role = watch('role');

//   useEffect(() => {
//   // тут логіка: активувати кнопку коли форма змінилася і валідна
//   // або просто коли валідна (залежить від того, що тобі треба)
//   const active = Boolean(isDirty && isValid);
//   // або якщо хочеш ставити активною при будь-якій зміні (навіть невалідній):
//   // const active = Boolean(isDirty);
//   setIsChanged?.(active);
// }, [isDirty, isValid, setIsChanged]);

//   const onSubmit = (data: FormValues) => {
//     console.log('Form submitted:', data);
//     reset({ ...data });
//     setIsChanged?.(false);
//     // тут можна викликати onSubmitCreate/onSubmitUpdate якщо потрібно
//   };

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.formBox}>
//         <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
//           {/* Email */}
//           <div>
//             <label className={styles.label}>Email</label>
//             <input
//               className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
//               type="email"
//               {...register('email', {
//                 required: 'Обовʼязково',
//                 pattern: {
//                   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                   message: 'Некоректний email',
//                 },
//                 // onChange: () => setIsChanged?.(true),
//               })}
//             />
//             {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
//           </div>

//           {/* Password */}
//           <div>
//             <label className={styles.label}>
//               Пароль {mode === 'create' ? <span style={{ color: '#e63946' }}>*</span> : <span style={{ color: 'var(--muted)' }}>(залиш порожнім — без змін)</span>}
//             </label>
//             <input
//               className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
//               type="password"
//               autoComplete="new-password"
//               {...register('password', {
//                 required: mode === 'create' ? 'Обовʼязково' : false,
//                 minLength: mode === 'create' ? { value: 6, message: 'Мінімум 6 символів' } : undefined,
//                 // onChange: () => setIsChanged?.(true),
//               })}
//             />
//             {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
//           </div>

//           {/* Role */}
//           <div>
//             <label className={styles.label}>Роль</label>
//             <select
//               className={`${styles.select} ${errors.role ? styles.errorInput : ''}`}
//               {...register('role', { required: 'Обовʼязково', onChange: () => setIsChanged?.(true) })}
//             >
//               <option value="owner_admin">owner_admin</option>
//               <option value="assistant">assistant</option>
//               <option value="club_admin">club_admin</option>
//             </select>
//             {errors.role && <p className={styles.errorText}>{errors.role.message}</p>}
//           </div>

//           {/* Club ID (тільки для club_admin) */}
//           {role === 'club_admin' && (
//             <div>
//               <label className={styles.label}>Club ID</label>
//               <input
//                 className={`${styles.input} ${errors.clubId ? styles.errorInput : ''}`}
//                 placeholder="наприклад: FC Kyiv"
//                 {...register('clubId', { required: 'Обовʼязково для club_admin', onChange: () => setIsChanged?.(true) })}
//               />
//               {errors.clubId && <p className={styles.errorText}>{errors.clubId.message}</p>}
//             </div>
//           )}

//           {/* Permissions */}
//           <div>
//             <label className={styles.label}>Права доступу</label>
//             <Controller
//               name="permissions"
//               control={control}
//               rules={{
//                 validate: (v) => (v?.length ?? 0) > 0 || 'Оберіть принаймні одне право',
//               }}
//               render={({ field }) => (
//                 <div className={styles.checkboxRow}>
//                   {ALL_PERMISSIONS.map((p) => {
//                     const active = field.value?.includes(p);
//                     return (
//                       <label key={p} className={`${styles.chip} ${active ? styles.chipActive : ''}`}>
//                         <input
//                           type="checkbox"
//                           checked={!!active}
//                           onChange={(e) => {
//                             if (e.target.checked) field.onChange([...(field.value || []), p]);
//                             else field.onChange((field.value || []).filter((x: Permission) => x !== p));
//                             setIsChanged?.(true);
//                           }}
//                         />
//                         {p}
//                       </label>
//                     );
//                   })}
//                 </div>
//               )}
//             />
//             {errors.permissions && <p className={styles.errorText}>{errors.permissions.message as string}</p>}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

//=====================


'use client';

import React, { forwardRef, useImperativeHandle, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './EmployeeForm.module.scss';

type Role = 'owner_admin' | 'assistant' | 'club_admin';
type Permission = 'all' | 'view_users' | 'club_dashboard' | 'manage_bookings';

const ALL_PERMISSIONS: Permission[] = [
  'all',
  'view_users',
  'club_dashboard',
  'manage_bookings',
];

export type FormValues = {
  email: string;
  password?: string;
  role: Role;
  clubId?: string;
  permissions: Permission[];
};

export type EmployeeFormHandle = {
  submit: () => void;
  isValid: () => boolean;
  getValues?: () => FormValues;
};

type Props = {
  mode: 'create' | 'edit';
  adminId?: string;
  defaultValues?: Partial<FormValues>;
  onSubmitCreate?: (data: FormValues) => Promise<void>;
  onSubmitUpdate?: (adminId: string, data: FormValues) => Promise<void>;
  isChanged?: boolean;
  setIsChanged?: (v: boolean) => void;
};

const EmployeeForm = forwardRef<EmployeeFormHandle, Props>(function EmployeeForm(
  {
    mode,
    adminId,
    defaultValues,
    onSubmitCreate,
    onSubmitUpdate,
    isChanged,
    setIsChanged,
  },
  ref
) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
    getValues,
  } = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      role: 'assistant',
      clubId: '',
      permissions: [],
      ...defaultValues,
    },
  });

  const role = watch('role');

 
  useEffect(() => {
    const active = Boolean(isDirty && isValid);
    setIsChanged?.(active);
  }, [isDirty, isValid, setIsChanged]);

 
  const submitHandler = useCallback(
    async (data: FormValues) => {
      try {
   
  console.log('Form submitted (parent):', data);

       if (adminId && typeof onSubmitUpdate === 'function') {
        console.log('calling onSubmitUpdate', adminId);
        await onSubmitUpdate(adminId, data);
      } else if (typeof onSubmitCreate === 'function') {
      
        console.log('calling onSubmitCreate');
        await onSubmitCreate(data);
      } else {
       
        console.log('No submit handler provided — form data:', data);
        return Promise.resolve();
      }
        // Після успіху:
      if (mode === 'create') {
       
        reset();
      } else {

        reset({ ...data, password: '' });
      }
        setIsChanged?.(false);
      } catch (err) {
        console.error('EmployeeForm submit error:', err);
       
        throw err;
      }
    },
    [mode, adminId, onSubmitCreate, onSubmitUpdate, reset, setIsChanged]
  );


  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
       
        handleSubmit(submitHandler)();
      },
      isValid: () => Boolean(isValid),
      getValues: () => getValues() as FormValues,
    }),
    [handleSubmit, submitHandler, isValid, getValues]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.formBox}>
        <form onSubmit={handleSubmit(submitHandler)} className={styles.form} noValidate>
          {/* Email */}
          <div>
            <label className={styles.label}>Email</label>
            <input
              className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
              type="email"
              {...register('email', {
                required: 'Обовʼязково',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Некоректний email',
                },
              })}
            />
            {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={styles.label}>
              Пароль {mode === 'create' ? <span style={{ color: '#e63946' }}>*</span> : <span style={{ color: 'var(--muted)' }}>(залиш порожнім — без змін)</span>}
            </label>
            <input
              className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
              type="password"
              autoComplete="new-password"
              {...register('password', {
                required: mode === 'create' ? 'Обовʼязково' : false,
                minLength: mode === 'create' ? { value: 6, message: 'Мінімум 6 символів' } : undefined,
              })}
            />
            {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
          </div>

          {/* Role */}
          <div>
            <label className={styles.label}>Роль</label>
            <select
              className={`${styles.select} ${errors.role ? styles.errorInput : ''}`}
              {...register('role', { required: 'Обовʼязково' })}
            >
              <option value="owner_admin">owner_admin</option>
              <option value="assistant">assistant</option>
              <option value="club_admin">club_admin</option>
            </select>
            {errors.role && <p className={styles.errorText}>{errors.role.message}</p>}
          </div>

          {/* Club ID (тільки для club_admin) */}
          {role === 'club_admin' && (
            <div>
              <label className={styles.label}>Club ID</label>
              <input
                className={`${styles.input} ${errors.clubId ? styles.errorInput : ''}`}
                placeholder="наприклад: FC Kyiv"
                {...register('clubId', { required: 'Обовʼязково для club_admin' })}
              />
              {errors.clubId && <p className={styles.errorText}>{errors.clubId.message}</p>}
            </div>
          )}

          {/* Permissions */}
          <div>
            <label className={styles.label}>Права доступу</label>
            <Controller
              name="permissions"
              control={control}
              rules={{
                validate: (v) => (v?.length ?? 0) > 0 || 'Оберіть принаймні одне право',
              }}
              render={({ field }) => (
                <div className={styles.checkboxRow}>
                  {ALL_PERMISSIONS.map((p) => {
                    const active = field.value?.includes(p);
                    return (
                      <label key={p} className={`${styles.chip} ${active ? styles.chipActive : ''}`}>
                        <input
                          type="checkbox"
                          checked={!!active}
                          onChange={(e) => {
                            if (e.target.checked) field.onChange([...(field.value || []), p]);
                            else field.onChange((field.value || []).filter((x: Permission) => x !== p));
                          }}
                        />
                        {p}
                      </label>
                    );
                  })}
                </div>
              )}
            />
            {errors.permissions && <p className={styles.errorText}>{errors.permissions.message as string}</p>}
          </div>
        </form>
      </div>
    </div>
  );
});

export default EmployeeForm;




