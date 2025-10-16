// const StaffFormNew =() => {
//     return (
//         <form ></form>

//     )
// }
// export default StaffFormNew;

'use client';

import { forwardRef, useImperativeHandle, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import styles from './StaffFormNew.module.scss';
import ClubSelectFieldAdd from '@/app/components/shared/Staff/StaffForm/ClubSelectAdd/ClubSelectFieldAdd';
import EmploymentTypeSelectField, {
  type EmploymentType,
} from '@/app/components/shared/Staff/StaffForm/EmploymentTypeSelectField/EmploymentTypeSelectField';
import AvatarUploadField from '@/app/components/shared/Staff/StaffForm/AvatarUploadField/AvatarUploadField';
import WorkingHoursField from '@/app/components/shared/Staff/StaffForm/WorkingHoursField/WorkingHoursField';
import StaffActionsBar from '@/app/components/shared/Staff/StaffForm/StaffActionsBar/StaffActionsBar';
import SalaryField from '@/app/components/shared/Staff/StaffForm/SalaryField/SalaryField';


export type StaffStatus = 'New' | 'Active' | 'Disabled' | 'Deleted';

type TimeRangeDto = { from: string | null; to: string | null };
type WorkingHourDto = {
  monday: TimeRangeDto;
  tuesday: TimeRangeDto;
  wednesday: TimeRangeDto;
  thursday: TimeRangeDto;
  friday: TimeRangeDto;
  saturday: TimeRangeDto;
  sunday: TimeRangeDto;
};

export type FormValues = {
  employmentType: EmploymentType;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  clubId: string;
  doB: string; // yyyy-mm-dd
  title: string; // посада
  phone: string | null; // телефон
  startDate: string; // yyyy-mm-dd

  imageUrl: string;
  salaryType: 'Hourly' | 'Salary' | 'PerTraining';
  hourlyRate: number | null;
  monthlySalary: number | null;
  perTrainingRate: number | null;
  currency: 'UAH' | 'USD' | null;
  payrollNotes?: string | null;
  notes?: string | null;
  staffStatus: StaffStatus;
  // workingHours: string; // JSON-рядок для бекенду
  workingHoursObj: WorkingHourDto;
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

export type StaffFormHandle = {
  submit: () => void;
  isValid: () => boolean;
  getValues?: () => FormValues;
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
  { mode, adminId, defaultValues, onSubmitCreate, onSubmitUpdate, setIsChanged },
  ref
) {
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
  } = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      clubId: '',
      doB: '',
      title: '',
      phone: null,
      startDate: todayStr, // дефолт — сьогодні
      employmentType: 'Employee',
      // workingHours: '',
       workingHoursObj: {
      monday:    { from: null, to: null },
      tuesday:   { from: null, to: null },
      wednesday: { from: null, to: null },
      thursday:  { from: null, to: null },
      friday:    { from: null, to: null },
      saturday:  { from: null, to: null },
      sunday:    { from: null, to: null },
    }, // дефолт — Employee
      salaryType: 'Hourly',
      hourlyRate: 0,
      monthlySalary: null,
      perTrainingRate: null,
      currency: 'UAH',
      payrollNotes: null,
      notes: null,
      staffStatus: 'New',
      ...defaultValues,
    },
  });

  // useEffect(() => {
  //   setIsChanged?.(Boolean(isDirty && isValid));
  // }, [isDirty, isValid, setIsChanged]);

   useEffect(() => {
   setIsChanged?.(isDirty && isValid);
 }, [isDirty, isValid, setIsChanged]);

  // const submitHandler = useCallback(
  //   async (raw: FormValues) => {
  //     if (adminId && onSubmitUpdate) {
  //       await onSubmitUpdate(adminId, raw);
  //     } else if (onSubmitCreate) {
  //       await onSubmitCreate(raw);
  //     }

  //     if (mode === 'create') reset();
  //     else reset({ ...raw, password: '' });

  //     setIsChanged?.(false);
  //   },
  //   [adminId, mode, onSubmitCreate, onSubmitUpdate, reset, setIsChanged]
  // );

  const submitHandler = useCallback(
    async (raw: FormValues) => {
      // '' -> null для бекенду
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
// console.error('📦 SUBMIT FORM VALUES:', normalized);
      if (adminId && onSubmitUpdate) {
        await onSubmitUpdate(adminId, normalized);
      } else if (onSubmitCreate) {
        await onSubmitCreate(normalized);
      }

      if (mode === 'create') reset();
      else reset({ ...normalized, password: '' });

      setIsChanged?.(false);
    },
    [adminId, mode, onSubmitCreate, onSubmitUpdate, reset, setIsChanged]
  );

  

  // useImperativeHandle(
  //   ref,
  //   () => ({
  //     submit: () => handleSubmit(submitHandler) (),
  //     isValid: () => Boolean(isValid),
  //     getValues: () => getValues() as FormValues,
  //   }),
  //   [handleSubmit, submitHandler, isValid, getValues]
  // );

  useImperativeHandle(
  ref,
  () => ({
    submit: () =>
      handleSubmit(
        submitHandler,
        (errs) => {
          // ⬇️ побачиш, чому не викликалось submitHandler
          // console.error('❌ RHF validation errors:', errs);
          // console.error('🧪 RHF current values:', getValues());
        }
      )(),
    isValid: () => Boolean(isValid),
    getValues: () => getValues() as FormValues,
  }),
  [handleSubmit, submitHandler, isValid, getValues]
);

  return (
    <div className={styles.wrapper}>
      <div className={styles.formBox}>
        <form onSubmit={handleSubmit(submitHandler)} className={styles.form} noValidate>
          {/* Avatar */}
          <div className={styles.topWrapperAvatarRow}>
            {/* <label className={styles.label}>Аватар</label> */}
            <AvatarUploadField
              control={control}
              name="imageUrl"
              // rootClassName=""
              // avatarClassName={styles.avatar}
              // avatarEmptyClassName={styles.avatarEmpty}
              // btnClassName={styles.button}
              // btnGhostClassName={styles.buttonGhost}
              // errorTextClassName={styles.errorText}
              // labelClassName={styles.label}
              // ⚠️ передай реальний аплоадер:
              uploadFile={async (file) => {
                // приклад: відправка на ваш бекенд
                // const formData = new FormData();
                // formData.append('file', file);
                // const res = await fetch('/api/upload', { method: 'POST', body: formData });
                // const { url } = await res.json();
                // return url as string;

                // тимчасово — емітуємо URL preview, щоб все працювало до інтеграції API:
                return new Promise<string>((resolve) => {
                  const tmp = URL.createObjectURL(file);
                  setTimeout(() => resolve(tmp), 400);
                });
              }}
            />
            <StaffActionsBar<FormValues>
              control={control}
              onRolesClick={() => {
                // TODO: відкриття модалки керування ролями (пізніше додамо)
              }}
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
                    hasDigit: (v) =>
                      hasDigit.test(v) || 'Password must contain at least one digit.',
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

            {/* Title */}
            <div>
              <label className={styles.label}>
                Посада <span style={{ color: '#e63946' }}>*</span>
              </label>
              <input
                className={`${styles.input} ${errors.title ? styles.errorInput : ''}`}
                type="text"
                placeholder="Наприклад: тренер, адміністратор"
                {...register('title', {
                  required: 'Посада є обовʼязковою.',
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
                Номер телефону <span style={{ color: '#e63946' }}>*</span>
              </label>
              <input
                className={`${styles.input} ${errors.phone ? styles.errorInput : ''}`}
                type="tel"
                placeholder="+380XXXXXXXXX"
                {...register('phone', {
                  required: 'Номер телефону є обовʼязковим.',
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

            {/* Start Date (no past dates) */}
            <div>
              <label className={styles.label}>
                Дата початку роботи <span style={{ color: '#e63946' }}>*</span>
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
              {errors.startDate && <p className={styles.errorText}>{errors.startDate.message}</p>}
            </div>

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
          {/* <label className={styles.label}>Робочі години</label> */}
          {/* <WorkingHoursField
            control={control}
            name="workingHoursObj"
            onSerializedChange={(json) => {
              // синхронізуємо рядок для відправки
              // @ts-ignore
              setValue('workingHours', json, { shouldDirty: true, shouldValidate: true });
            }}
          /> */}
          <WorkingHoursField control={control} name="workingHoursObj" />
          <SalaryField<FormValues> control={control} />
          {/* Нотатки для бухгалтерії */}
          <div>
            <label className={styles.label}>Нотатки для бухгалтерії</label>
            <textarea
              className={`${styles.textarea} ${errors.payrollNotes ? styles.errorInput : ''}`}
              rows={4}
              placeholder="Деталі виплат, домовленості тощо"
              {...register('payrollNotes', {
                maxLength: { value: 2000, message: 'Занадто довгий текст (макс. 2000 символів).' },
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
                maxLength: { value: 2000, message: 'Занадто довгий текст (макс. 2000 символів).' },
              })}
            />
            {errors.notes && <p className={styles.errorText}>{errors.notes.message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
});

export default StaffFormNew;
