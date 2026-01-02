// export default StaffFormNew;

'use client';

import { forwardRef, useImperativeHandle, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './StaffFormNew.module.scss';
import ClubSelectFieldAdd from '@/app/components/ui/InputSelectClubs/ClubSelectAdd/ClubSelectFieldAdd';
import EmploymentTypeSelectField, {
  type EmploymentType,
} from '@/app/components/shared/Staff/StaffForm/EmploymentTypeSelectField/EmploymentTypeSelectField';
import AvatarUploadField from '@/app/components/shared/Staff/StaffForm/AvatarUploadField/AvatarUploadField';
import WorkingHoursField from '@/app/components/ui/WorkingHoursField/WorkingHoursField';
import StaffActionsBar from '@/app/components/shared/Staff/StaffForm/StaffActionsBar/StaffActionsBar';
import SalaryField from '@/app/components/shared/Staff/StaffForm/SalaryField/SalaryField';
import ClubReadonlyField from '@/app/components/ui/InputSelectClubs/ClubReadonlyField/ClubReadonlyField';

import ScrollArea from '@/app/components/ui/Scroll/ScrollArea';

export type StaffStatus = 'New' | 'Active' | 'Disabled' | 'Deleted';

type TimeRangeDto = { from: string | null; to: string | null };
export type WorkingHourDto = {
  monday: TimeRangeDto | null;
  tuesday: TimeRangeDto | null;
  wednesday: TimeRangeDto | null;
  thursday: TimeRangeDto | null;
  friday: TimeRangeDto | null;
  saturday: TimeRangeDto | null;
  sunday: TimeRangeDto | null;
};

export type FormValues = {
  employmentType: EmploymentType;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  clubId: string;
  doB: string;
  title: string;
  phone: string | null;
  startDate: string;

  imageUrl: string;
  salaryType: 'Hourly' | 'Salary' | 'PerTraining';
  hourlyRate: number | null;
  monthlySalary: number | null;
  perTrainingRate: number | null;
  currency: 'UAH' | 'USD' | null;
  payrollNotes?: string | null;
  notes?: string | null;
  staffStatus: StaffStatus;
  endDate?: string | null;
  roleId: string | null;
  userId?: string | null;

  workingHours: WorkingHourDto;
};

type Props = {
  mode: 'create' | 'edit';
  staffId?: string;
  userId?: string | undefined;
  defaultValues?: Partial<FormValues>;
  onSubmitCreate?: (data: FormValues) => Promise<void>;
  onSubmitUpdate?: (staffId: string, data: FormValues) => Promise<void>;
  isChanged?: boolean;
  setIsChanged?: (v: boolean) => void;
  busy?: boolean;
  scopedClubId?: string; // clubId з контексту клубного адміна (з URL/бекенду)
  isClubScoped?: boolean;
};

export type StaffFormHandle = {
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

// const EMPLOYMENT_OPTIONS: EmploymentType[] = ['Employee', 'Contractor', 'PartTime', 'Volunteer'];

const StaffFormNew = forwardRef<StaffFormHandle, Props>(function EmployeeForm(
  {
    mode,
    staffId,
    defaultValues,
    onSubmitCreate,
    onSubmitUpdate,
    setIsChanged,
    busy,
    scopedClubId,
    isClubScoped,
  }: Props,
  ref
) {
  const [isPasswordChangeEnabled, setPasswordChangeEnabled] = useState(false);
  // сьогодні у форматі yyyy-mm-dd для min у даті
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
    getValues,
    setValue,
    setError,
  } = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      // clubId: '',
      doB: '',
      title: '',
      phone: null,
      startDate: todayStr,
      employmentType: 'Employee',
      clubId: scopedClubId ?? '',

      // workingHours: '',
      workingHours: {
        monday: { from: null, to: null },
        tuesday: { from: null, to: null },
        wednesday: { from: null, to: null },
        thursday: { from: null, to: null },
        friday: { from: null, to: null },
        saturday: { from: null, to: null },
        sunday: { from: null, to: null },
      }, // дефолт — Employee
      salaryType: 'Hourly',
      hourlyRate: 0,
      monthlySalary: null,
      perTrainingRate: null,
      currency: 'UAH',
      payrollNotes: null,
      notes: null,
      staffStatus: 'New',
      endDate: null,
      roleId: null,
      userId: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    setIsChanged?.(isDirty && isValid);
  }, [isDirty, isValid, setIsChanged]);

  const submitHandler = useCallback(
    async (raw: FormValues) => {
      const normalized: FormValues = {
        ...raw,
        phone: raw.phone?.trim() ? raw.phone : null,
        hourlyRate: raw.hourlyRate || 0,
        monthlySalary: raw.monthlySalary || 0,
        perTrainingRate: raw.perTrainingRate || 0,
        currency: raw.currency || null,

        payrollNotes: raw.payrollNotes?.trim() ? raw.payrollNotes : null,
        notes: raw.notes?.trim() ? raw.notes : null,
      };
      console.log('📦 SUBMIT FORM VALUES:', normalized);

      if (staffId && onSubmitUpdate) {
        await onSubmitUpdate(staffId, normalized);
      } else if (onSubmitCreate) {
        await onSubmitCreate(normalized);
      }

      if (mode === 'create') reset();
      else reset({ ...normalized, password: '' });

      setIsChanged?.(false);
    },
    [staffId, mode, onSubmitCreate, onSubmitUpdate, reset, setIsChanged]
  );

  useImperativeHandle(
    ref,
    () => ({
      submit: () =>
        handleSubmit(submitHandler, (errs) => {
          // ⬇️ побачиш, чому не викликалось submitHandler
          console.error('❌ RHF validation errors:', errs);
          console.error('🧪 RHF current values:', getValues());
        })(),
      isValid: () => Boolean(isValid),
      getValues: () => getValues() as FormValues,
      setFieldError: (name, message) => setError(name, { type: 'server', message }),
    }),
    [handleSubmit, submitHandler, isValid, getValues]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.formBox}>
        <ScrollArea className={styles.formScroll}>
          <form onSubmit={handleSubmit(submitHandler)} className={styles.form} noValidate>
            {/* Avatar */}
            <div className={styles.topWrapperAvatarRow}>
              {/* <label className={styles.label}>Аватар</label> */}
              <AvatarUploadField
                control={control}
                name="imageUrl"
                uploadFile={async (file) => {
                  return new Promise<string>((resolve) => {
                    const tmp = URL.createObjectURL(file);
                    setTimeout(() => resolve(tmp), 400);
                  });
                }}
              />

              <StaffActionsBar<FormValues>
                staffId={staffId}
                control={control}
                showRolesButton={mode === 'edit'}
                onEnablePasswordChangeAction={() =>
                  setPasswordChangeEnabled(!isPasswordChangeEnabled)
                }
              />
            </div>
            <div className={styles.formGrid}>
              {/* First name */}
              <div>
                <label className={styles.label}>
                  Імʼя <span style={{ color: '#e63946' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.firstName ? styles.errorInput : ''}`}
                  {...register('firstName', {
                    required: mode === 'create' ? 'First name is required.' : false,
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
                    required: mode === 'create' ? 'Last name is required.' : false,
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
                    required: mode === 'create' ? 'Email is required.' : false,
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

              {mode === 'create' && (
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
                        noSpace: (v) =>
                          noWhitespace.test(v) || 'Password cannot contain whitespace.',
                        hasDigit: (v) =>
                          hasDigit.test(v) || 'Password must contain at least one digit.',
                        hasUpper: (v) =>
                          hasUpper.test(v) ||
                          'Password must contain at least one uppercase letter.',
                        hasLower: (v) =>
                          hasLower.test(v) ||
                          'Password must contain at least one lowercase letter.',
                        hasSpecial: (v) =>
                          hasSpecial.test(v) ||
                          'Password must contain at least one special character.',
                      },
                    })}
                  />
                  {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
                </div>
              )}

              {/*Change Password */}
              {isPasswordChangeEnabled && (
                <div>
                  <label className={styles.label}>Зміна паролю</label>
                  <input
                    className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
                    type="password"
                    autoComplete="new-password"
                    {...register('password', {
                      // !!! для зміни паролю він НЕ має бути required
                      validate: {
                        isEmptyOrValid: (v: string) => {
                          if (!v) return true; // нічого не ввели -> ок
                          if (v.length < 8) return 'Min 8 symbols';
                          if (v.length > 64) return 'Max 64 symbols';
                          if (!noWhitespace.test(v)) return 'Без пробілів';
                          if (!hasDigit.test(v)) return 'Має бути цифра';
                          if (!hasUpper.test(v)) return 'Має бути велика літера';
                          if (!hasLower.test(v)) return 'Має бути мала літера';
                          if (!hasSpecial.test(v)) return 'Має бути спецсимвол';
                          return true;
                        },
                      },
                    })}
                  />
                  {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
                </div>
              )}

              {/* Title */}
              <div>
                <label className={styles.label}>
                  Посада {mode === 'create' && <span style={{ color: '#e63946' }}>*</span>}
                </label>
                <input
                  className={`${styles.input} ${errors.title ? styles.errorInput : ''}`}
                  type="text"
                  placeholder="Наприклад: тренер, адміністратор"
                  {...register('title', {
                    required: mode === 'create' ? 'Email is required.' : false,
                    minLength: { value: 2, message: 'Назва посади занадто коротка.' },
                    maxLength: { value: 60, message: 'Назва посади занадто довга.' },
                    pattern: {
                      value: /^[\p{L}\s'’-]+$/u,
                      message: 'Посада може містити лише літери та пробіли.',
                    },
                  })}
                />
                {errors.title && <p className={styles.errorText}>{errors.title.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className={styles.label}>
                  Номер телефону {mode === 'create' && <span style={{ color: '#e63946' }}>*</span>}
                </label>
                <input
                  className={`${styles.input} ${errors.phone ? styles.errorInput : ''}`}
                  type="tel"
                  placeholder="+380XXXXXXXXX"
                  {...register('phone', {
                    required: mode === 'create' ? 'Email is required.' : false,
                    pattern: {
                      value: /^\+?380\d{9}$/,
                      message: 'Номер має бути у форматі +380XXXXXXXXX.',
                    },
                  })}
                />
                {errors.phone && <p className={styles.errorText}>{errors.phone.message}</p>}
              </div>

              {/* Club ID (combobox) */}
              <div>
                <label className={styles.label}>
                  Клуб {mode === 'create' && <span style={{ color: '#e63946' }}>*</span>}
                </label>

                {isClubScoped ? (
                  // 🔹 Адмін КОНКРЕТНОГО клубу: клуб зафіксований, без вибору
                  <ClubReadonlyField
                    control={control}
                    name="clubId"
                    rootClassName={styles.comboRoot}
                    inputClassName={`${styles.input} ${styles.inputChevron} ${
                      errors.clubId ? styles.errorInput : ''
                    }`}
                    forcedClubId={scopedClubId}
                  />
                ) : (
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
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className={styles.label}>
                  Дата народження {mode === 'create' && <span style={{ color: '#e63946' }}>*</span>}
                </label>
                <input
                  className={`${styles.input} ${errors.doB ? styles.errorInput : ''}`}
                  type="date"
                  {...register('doB', {
                    required: mode === 'create' ? 'Email is required.' : false,
                    validate: (v) => isAtLeast8Years(v) || 'You must be at least 8 years old.',
                  })}
                />
                {errors.doB && <p className={styles.errorText}>{errors.doB.message}</p>}
              </div>

              {/* Start Date (no past dates) */}
              {mode === 'create' && (
                <div>
                  <label className={styles.label}>
                    Дата початку роботи{' '}
                    {mode === 'create' && <span style={{ color: '#e63946' }}>*</span>}
                  </label>
                  <input
                    className={`${styles.input} ${errors.startDate ? styles.errorInput : ''}`}
                    type="date"
                    min={todayStr}
                    {...register('startDate', {
                      required: 'Дата початку є обовʼязковою.',
                      validate: (v) => !v || v >= todayStr || 'Не можна обирати дату в минулому.',
                    })}
                  />
                  {errors.startDate && (
                    <p className={styles.errorText}>{errors.startDate.message}</p>
                  )}
                </div>
              )}
              {mode === 'edit' && (
                <div>
                  <label className={styles.label}>
                    Дата початку роботи{' '}
                    {mode !== 'edit' && <span style={{ color: '#e63946' }}>*</span>}
                  </label>
                  <input
                    className={`${styles.input} ${errors.startDate ? styles.errorInput : ''}`}
                    type="date"
                    min={todayStr}
                    {...register('startDate', {
                      // required: 'Дата початку є обовʼязковою.',
                      // validate: (v) => !v || v >= todayStr || 'Не можна обирати дату в минулому.',
                    })}
                  />
                  {errors.startDate && (
                    <p className={styles.errorText}>{errors.startDate.message}</p>
                  )}
                </div>
              )}

              {/* End Date (no past dates) */}
              {mode === 'edit' && (
                <div>
                  <label className={styles.label}>Дата завершення роботи</label>
                  <input
                    className={styles.input}
                    type="date"
                    min={todayStr}
                    {...register('endDate', {
                      validate: (v) => !v || v >= todayStr || 'Не можна обирати дату в минулому.',
                    })}
                  />
                  {errors.endDate && <p className={styles.errorText}>{errors.endDate.message}</p>}
                </div>
              )}

              {/* Employment Type (combobox like Club) */}
              <div>
                <label className={styles.label}>
                  Тип зайнятості <span style={{ color: '#e63946' }}>*</span>
                </label>

                <EmploymentTypeSelectField<FormValues>
                  control={control}
                  name="employmentType"
                  rootClassName={styles.comboRoot}
                  inputClassName={`${styles.input} ${styles.inputChevron} ${errors.employmentType ? styles.errorInput : ''}`}
                  optionsClassName={styles.options}
                  optionClassName={styles.option}
                  optionActiveClassName={styles.optionActive}
                  chevronClassName={styles.comboChevron}
                  placeholder="Оберіть тип зайнятості…"
                />
              </div>
            </div>
            {/* Working hours */}
            <WorkingHoursField control={control} name="workingHours" />

            <SalaryField<FormValues> control={control} />
            {/* Нотатки для бухгалтерії */}
            <div>
              <label className={styles.label}>Нотатки для бухгалтерії</label>
              <textarea
                className={`${styles.textarea} ${errors.payrollNotes ? styles.errorInput : ''}`}
                rows={4}
                placeholder="Деталі виплат, домовленості тощо"
                {...register('payrollNotes', {
                  maxLength: {
                    value: 2000,
                    message: 'Занадто довгий текст (макс. 2000 символів).',
                  },
                })}
              />
              {errors.payrollNotes && (
                <p className={styles.errorText}>{errors.payrollNotes.message}</p>
              )}
            </div>

            {/* Загальні нотатки */}
            <div>
              <label className={styles.label}>Загальні нотатки</label>
              <textarea
                className={`${styles.textarea} ${errors.notes ? styles.errorInput : ''}`}
                rows={4}
                placeholder="Будь-які службові помітки"
                {...register('notes', {
                  maxLength: {
                    value: 2000,
                    message: 'Занадто довгий текст (макс. 2000 символів).',
                  },
                })}
              />
              {errors.notes && <p className={styles.errorText}>{errors.notes.message}</p>}
            </div>
          </form>
        </ScrollArea>
      </div>
      {Boolean(busy) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(255,255,255,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div className="spinner" />
        </div>
      )}
    </div>
  );
});

export default StaffFormNew;
