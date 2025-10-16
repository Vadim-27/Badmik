

// UserForm.tsx
'use client';

import { forwardRef, useImperativeHandle, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './PlayerForm.module.scss';
import ClubSelectFieldAdd from '@/app/components/shared/Staff/StaffForm/ClubSelectAdd/ClubSelectFieldAdd';
import CircularProgress from "@mui/material/CircularProgress";

export type FormValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  clubId: string;
  doB: string; // yyyy-mm-dd з <input type="date" />
};

type Props = {
  mode: 'create' | 'edit';
  adminId?: string;
  defaultValues?: Partial<FormValues>;
  onSubmitCreate?: (data: FormValues) => Promise<void>;
  onSubmitUpdate?: (adminId: string, data: FormValues) => Promise<void>;
  isChanged?: boolean;
  setIsChanged?: (v: boolean) => void;
  busy?: boolean; 
};

export type PlayerFormHandle = {
  submit: () => void;
  isValid: () => boolean;
  getValues?: () => FormValues;
  setFieldError?: (name: keyof FormValues, message: string) => void; 
};

function isAtLeast8Years(oldDateStr: string) {
  if (!oldDateStr) return false;
  const d = new Date(oldDateStr);
  const now = new Date();
  const eightYearsAgo = new Date(now.getFullYear() - 8, now.getMonth(), now.getDate());
  return d <= eightYearsAgo;
}

const nameOnlyLetters = /^[\p{L}'’-]+$/u;
const hasDigit = /\d/;
const hasUpper = /[A-Z]/;
const hasLower = /[a-z]/;
const hasSpecial = /[!@#$%^&*()_+\-=[\]{}|;':",.<>?/`~]/;
const noWhitespace = /^\S+$/;

const PlayerForm = forwardRef<PlayerFormHandle, Props>(function UserForm(
  { mode, adminId, defaultValues, onSubmitCreate, onSubmitUpdate, setIsChanged, busy },
  ref
) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
    getValues,
    setError,
  } = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      clubId: '',
      doB: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    setIsChanged?.(Boolean(isDirty && isValid));
  }, [isDirty, isValid, setIsChanged]);

  const submitHandler = useCallback(
    async (raw: FormValues) => {
      // НІЯКИХ API тут. Тільки проброс даних нагору:
        try {
        // лише проброс у батька; тут НІЯКИХ API
        if (adminId && onSubmitUpdate) await onSubmitUpdate(adminId, raw);
        else if (onSubmitCreate) await onSubmitCreate(raw);

        // ⬅️ скидаємо форму ТІЛЬКИ якщо вище не кинуто помилку
        if (mode === 'create') reset();
        else reset({ ...raw, password: '' });

        setIsChanged?.(false);
      } catch {
        // на помилці форму НЕ чіпаємо
      }
    },
    [adminId, mode, onSubmitCreate, onSubmitUpdate, reset, setIsChanged]
  );

  useImperativeHandle(
    ref,
    () => ({
      submit: () => handleSubmit(submitHandler)(),
      isValid: () => Boolean(isValid),
      getValues: () => getValues() as FormValues,
      setFieldError: (name, message) => setError(name, { type: 'server', message }),
    }),
    [handleSubmit, submitHandler, isValid, getValues, setError]
  );

  const isBusy = Boolean(busy);

  return (
    <div className={styles.wrapper}>
      <div className={styles.formBox}>
        <form onSubmit={handleSubmit(submitHandler)} className={styles.form} noValidate>
          {/* First name */}
          <div>
            <label className={styles.label}>
              Імʼя <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              className={`${styles.input} ${errors.firstName ? styles.errorInput : ''}`}
              {...register('firstName', {
                required: 'First name is required.',
                minLength: { value: 2, message: 'First name is too short.' },
                maxLength: { value: 60, message: 'First name is too long.' },
                pattern: {
                  value: nameOnlyLetters,
                  message: 'First name contains invalid characters.',
                },
              })}
            />
            {errors.firstName && <p className={styles.errorText}>{errors.firstName.message}</p>}
          </div>

          {/* Last name */}
          <div>
            <label className={styles.label}>
              Прізвище <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              className={`${styles.input} ${errors.lastName ? styles.errorInput : ''}`}
              {...register('lastName', {
                required: 'Last name is required.',
                minLength: { value: 2, message: 'Last name is too short.' },
                maxLength: { value: 50, message: 'Last name is too long.' },
                pattern: {
                  value: nameOnlyLetters,
                  message: 'Last name contains invalid characters.',
                },
              })}
            />
            {errors.lastName && <p className={styles.errorText}>{errors.lastName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className={styles.label}>
              Email <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
              type="email"
              {...register('email', {
                required: 'Email is required.',
                minLength: { value: 5, message: 'Email is too short.' },
                maxLength: { value: 254, message: 'Email is too long.' },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email format is invalid.',
                },
              })}
            />
            {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={styles.label}>
              Пароль <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
              type="password"
              autoComplete="new-password"
              {...register('password', {
                required: 'Password is required.',
                minLength: { value: 8, message: 'Password must be at least 8 characters.' },
                maxLength: { value: 64, message: 'Password must be at most 64 characters.' },
                validate: {
                  noSpace: (v) => noWhitespace.test(v) || 'Password cannot contain whitespace.',
                  hasDigit: (v) => hasDigit.test(v) || 'Password must contain at least one digit.',
                  hasUpper: (v) =>
                    hasUpper.test(v) || 'Password must contain at least one uppercase letter.',
                  hasLower: (v) =>
                    hasLower.test(v) || 'Password must contain at least one lowercase letter.',
                  hasSpecial: (v) =>
                    hasSpecial.test(v) || 'Password must contain at least one special character.',
                },
              })}
            />
            {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
          </div>

          {/* Club ID */}
          <div>
            <label className={styles.label}>
              Клуб <span style={{ color: '#e63946' }}>*</span>
            </label>
            <ClubSelectFieldAdd
              control={control}
              name="clubId"
              rootClassName={styles.comboRoot}
              inputClassName={`${styles.input} ${styles.inputChevron} ${errors.clubId ? styles.errorInput : ''}`}
              optionsClassName={styles.options}
              optionClassName={styles.option}
              optionActiveClassName={styles.optionActive}
              chevronClassName={styles.comboChevron}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className={styles.label}>
              Дата народження <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              className={`${styles.input} ${errors.doB ? styles.errorInput : ''}`}
              type="date"
              {...register('doB', {
                required: 'Date of birth is required.',
                validate: (v) => isAtLeast8Years(v) || 'You must be at least 8 years old.',
              })}
            />
            {errors.doB && <p className={styles.errorText}>{errors.doB.message}</p>}
          </div>
        </form>
      </div>
      {isBusy && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px",
            zIndex: 10,
          }}
        >
          <CircularProgress size="3rem" />
        </div>
      )}
    </div>
  );
});

export default PlayerForm;
