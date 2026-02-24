'use client';

import {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
} from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import styles from './ClubForm.module.scss';
import ScrollArea from '@/app/components/ui/Scroll/ScrollArea';
import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';

export type ClubFormValues = {
  name: string;
  alias: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
};

type Props = {
  mode: 'create' | 'edit';
  clubId?: string;
  defaultValues?: Partial<ClubFormValues>;
  onSubmitCreate?: (data: ClubFormValues) => Promise<void>;
  onSubmitUpdate?: (clubId: string, data: ClubFormValues) => Promise<void>;
  isChanged?: boolean;
  setIsChanged?: (v: boolean) => void;
  busy?: boolean;
};

export type ClubFormHandle = {
  submit: () => void;
  isValid: () => boolean;
  getValues: () => ClubFormValues;
  setFieldError: (name: keyof ClubFormValues, message: string) => void;
};

const ClubForm = forwardRef<ClubFormHandle, Props>(function ClubForm(
  { mode, clubId, defaultValues, onSubmitCreate, onSubmitUpdate, setIsChanged, busy },
  ref
) {
  const t = useTranslations('clubForm');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
    getValues,
    setError,
  } = useForm<ClubFormValues>({
    mode: 'all',
    defaultValues: {
      name: '',
      alias: '',
      city: '',
      address: '',
      email: '',
      phone: '',
      website: '',
      description: '',
      isActive: true,
      sortOrder: 1,
      ...defaultValues,
    },
  });

  useEffect(() => {
    setIsChanged?.(isDirty && isValid);
  }, [isDirty, isValid, setIsChanged]);

  const submitHandler = useCallback(
    async (raw: ClubFormValues) => {
      const normalized: ClubFormValues = {
        ...raw,
        name: raw.name.trim(),
        alias: raw.alias.trim(),
        city: raw.city.trim(),
        address: raw.address.trim(),
        email: raw.email.trim(),
        phone: raw.phone.trim(),
        website: raw.website.trim(),
        description: raw.description.trim(),
        sortOrder: Number.isFinite(raw.sortOrder) ? Number(raw.sortOrder) : 1,
      };

      if (clubId && onSubmitUpdate) {
        await onSubmitUpdate(clubId, normalized);
      } else if (onSubmitCreate) {
        await onSubmitCreate(normalized);
      }

      if (mode === 'create') {
        reset({
          name: '',
          alias: '',
          city: '',
          address: '',
          email: '',
          phone: '',
          website: '',
          description: '',
          isActive: true,
          sortOrder: 1,
        });
      }

      setIsChanged?.(false);
    },
    [clubId, mode, onSubmitCreate, onSubmitUpdate, reset, setIsChanged]
  );

  useImperativeHandle(
    ref,
    () => ({
      submit: () =>
        handleSubmit(submitHandler, (errs) => {
          console.error('❌ RHF validation errors:', errs);
          console.error('🧪 RHF current values:', getValues());
        })(),
      isValid: () => Boolean(isValid),
      getValues: () => getValues() as ClubFormValues,
      setFieldError: (name, message) =>
        setError(name, { type: 'server', message }),
    }),
    [handleSubmit, submitHandler, isValid, getValues, setError]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.formBox}>
        <ScrollArea className={styles.formScroll}>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className={styles.form}
            noValidate
          >
            {/* 1 ряд: Назва / Alias */}
            <div className={styles.formGrid}>
              <div>
                <label className={styles.label}>
                  {t('labels.name')} *
                </label>
                <input
                  className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
                  {...register('name', {
                    required: t('validation.required'),
                    minLength: { value: 3, message: t('validation.name.min') },
                    maxLength: { value: 200, message: t('validation.name.max') },
                  })}
                  placeholder={t('placeholders.name')}
                />
                {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
              </div>

              <div>
                <label className={styles.label}>
                  {t('labels.alias')} *
                </label>
                <input
                  className={`${styles.input} ${errors.alias ? styles.errorInput : ''}`}
                  {...register('alias', {
                    required: t('validation.required'),
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: t('validation.alias.pattern'),
                    },
                    maxLength: { value: 100, message: t('validation.alias.max') },
                  })}
                  placeholder={t('placeholders.alias')}
                />
                {errors.alias && <p className={styles.errorText}>{errors.alias.message}</p>}
              </div>
            </div>

            {/* 2 ряд: Місто / Адреса */}
            <div className={styles.formGrid}>
              <div>
                <label className={styles.label}>
                  {t('labels.city')} *
                </label>
                <input
                  className={`${styles.input} ${errors.city ? styles.errorInput : ''}`}
                  {...register('city', {
                    required: t('validation.required'),
                    maxLength: { value: 100, message: t('validation.city.max') },
                  })}
                  placeholder={t('placeholders.city')}
                />
                {errors.city && <p className={styles.errorText}>{errors.city.message}</p>}
              </div>

              <div>
                <label className={styles.label}>
                  {t('labels.address')} *
                </label>
                <input
                  className={`${styles.input} ${errors.address ? styles.errorInput : ''}`}
                  {...register('address', {
                    required: t('validation.required'),
                    maxLength: { value: 200, message: t('validation.address.max') },
                  })}
                  placeholder={t('placeholders.address')}
                />
                {errors.address && <p className={styles.errorText}>{errors.address.message}</p>}
              </div>
            </div>

            {/* 3 ряд: Email / Телефон */}
            <div className={styles.formGrid}>
              <div>
                <label className={styles.label}>{t('labels.email')}</label>
                <input
                  className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                  type="email"
                  {...register('email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t('validation.email.pattern'),
                    },
                    maxLength: { value: 254, message: t('validation.email.max') },
                  })}
                  placeholder={t('placeholders.email')}
                />
                {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
              </div>

              <div>
                <label className={styles.label}>{t('labels.phone')}</label>
                <input
                  className={`${styles.input} ${errors.phone ? styles.errorInput : ''}`}
                  type="tel"
                  {...register('phone', {
                    maxLength: { value: 50, message: t('validation.phone.max') },
                  })}
                  placeholder={t('placeholders.phone')}
                />
                {errors.phone && <p className={styles.errorText}>{errors.phone.message}</p>}
              </div>
            </div>

            {/* Website */}
            <div>
              <label className={styles.label}>{t('labels.website')}</label>
              <input
                className={`${styles.input} ${errors.website ? styles.errorInput : ''}`}
                {...register('website', {
                  pattern: {
                    value: /^$|^https?:\/\/.+$/i,
                    message: t('validation.website.pattern'),
                  },
                  maxLength: { value: 300, message: t('validation.website.max') },
                })}
                placeholder={t('placeholders.website')}
              />
              {errors.website && <p className={styles.errorText}>{errors.website.message}</p>}
            </div>

            {/* Опис */}
            <div>
              <label className={styles.label}>{t('labels.description')}</label>
              <textarea
                className={styles.textarea}
                rows={4}
                {...register('description', {
                  maxLength: { value: 1000, message: t('validation.description.max') },
                })}
                placeholder={t('placeholders.description')}
              />
              {errors.description && <p className={styles.errorText}>{errors.description.message}</p>}
            </div>

            {/* Нижній ряд: чекбокс + порядок */}
            <div className={styles.bottomRow}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('isActive')} />
                <span>{t('labels.active')}</span>
              </label>

              <div className={styles.orderField}>
                <span className={styles.labelInline}>{t('labels.order')}:</span>
                <input
                  type="number"
                  min={1}
                  className={`${styles.input} ${styles.orderInput} ${
                    errors.sortOrder ? styles.errorInput : ''
                  }`}
                  {...register('sortOrder', {
                    required: t('validation.required'),
                    min: { value: 1, message: t('validation.order.min') },
                    valueAsNumber: true,
                  })}
                  onWheel={(e) => e.currentTarget.blur()}
                />
                {errors.sortOrder && (
                  <p className={styles.errorText}>{errors.sortOrder.message}</p>
                )}
              </div>
            </div>
          </form>
        </ScrollArea>
      </div>

      {busy && <SpinnerOverlay fullscreen={false} />}
    </div>
  );
});

export default ClubForm;




//================================================


// 'use client';

// import {
//   forwardRef,
//   useImperativeHandle,
//   useCallback,
//   useEffect,
// } from 'react';
// import { useForm } from 'react-hook-form';
// import styles from './ClubForm.module.scss';
// import ScrollArea from '@/app/components/ui/Scroll/ScrollArea';
// import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';

// export type ClubFormValues = {
//   name: string;
//   alias: string;
//   city: string;
//   address: string;
//   email: string;
//   phone: string;
//   website: string;
//   description: string;
//   isActive: boolean;
//   sortOrder: number;
// };

// type Props = {
//   mode: 'create' | 'edit';
//   clubId?: string;
//   defaultValues?: Partial<ClubFormValues>;
//   onSubmitCreate?: (data: ClubFormValues) => Promise<void>;
//   onSubmitUpdate?: (clubId: string, data: ClubFormValues) => Promise<void>;
//   isChanged?: boolean;
//   setIsChanged?: (v: boolean) => void;
//   busy?: boolean;
// };

// export type ClubFormHandle = {
//   submit: () => void;
//   isValid: () => boolean;
//   getValues: () => ClubFormValues;
//   setFieldError: (name: keyof ClubFormValues, message: string) => void;
// };

// const ClubForm = forwardRef<ClubFormHandle, Props>(function ClubForm(
//   { mode, clubId, defaultValues, onSubmitCreate, onSubmitUpdate, setIsChanged, busy },
//   ref
// ) {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isDirty, isValid },
//     getValues,
//     setError,
//   } = useForm<ClubFormValues>({
//     mode: 'all',
//     defaultValues: {
//       name: '',
//       alias: '',
//       city: '',
//       address: '',
//       email: '',
//       phone: '',
//       website: '',
//       description: '',
//       isActive: true,
//       sortOrder: 1,
//       ...defaultValues,
//     },
//   });

//   // включаємо/виключаємо кнопку Save у хедері
//   useEffect(() => {
//     setIsChanged?.(isDirty && isValid);
//   }, [isDirty, isValid, setIsChanged]);

//   const submitHandler = useCallback(
//     async (raw: ClubFormValues) => {
//       const normalized: ClubFormValues = {
//         ...raw,
//         name: raw.name.trim(),
//         alias: raw.alias.trim(),
//         city: raw.city.trim(),
//         address: raw.address.trim(),
//         email: raw.email.trim(),
//         phone: raw.phone.trim(),
//         website: raw.website.trim(),
//         description: raw.description.trim(),
//         sortOrder: Number.isFinite(raw.sortOrder)
//           ? Number(raw.sortOrder)
//           : 1,
//       };

//       if (clubId && onSubmitUpdate) {
//         await onSubmitUpdate(clubId, normalized);
//       } else if (onSubmitCreate) {
//         await onSubmitCreate(normalized);
//       }

//       // if (mode === 'create') {
//       //   reset(normalized);
//       // }

//       if (mode === 'create') {
//   reset({
//     name: '',
//     alias: '',
//     city: '',
//     address: '',
//     email: '',
//     phone: '',
//     website: '',
//     description: '',
//     isActive: true,
//     sortOrder: 1,
//   });
// }

//       setIsChanged?.(false);
//     },
//     [clubId, mode, onSubmitCreate, onSubmitUpdate, reset, setIsChanged]
//   );

//   useImperativeHandle(
//     ref,
//     () => ({
//       submit: () =>
//         handleSubmit(submitHandler, (errs) => {
//           console.error('❌ RHF validation errors:', errs);
//           console.error('🧪 RHF current values:', getValues());
//         })(),
//       isValid: () => Boolean(isValid),
//       getValues: () => getValues() as ClubFormValues,
//       setFieldError: (name, message) =>
//         setError(name, { type: 'server', message }),
//     }),
//     [handleSubmit, submitHandler, isValid, getValues, setError]
//   );

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.formBox}>
//         <ScrollArea className={styles.formScroll}>
//           <form
//             onSubmit={handleSubmit(submitHandler)}
//             className={styles.form}
//             noValidate
//           >
//             {/* 1 ряд: Назва / Alias */}
//             <div className={styles.formGrid}>
//               <div>
//                 <label className={styles.label}>
//                   НАЗВА КЛУБУ *
//                 </label>
//                 <input
//                   className={`${styles.input} ${
//                     errors.name ? styles.errorInput : ''
//                   }`}
//                   {...register('name', {
//                     required: 'Обовʼязково',
//                     minLength: {
//                       value: 3,
//                       message: 'Мінімум 3 символи',
//                     },
//                     maxLength: {
//                       value: 200,
//                       message: 'Занадто довга назва',
//                     },
//                   })}
//                   placeholder="Badmik Club Kyiv"
//                 />
//                 {errors.name && (
//                   <p className={styles.errorText}>
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className={styles.label}>ALIAS *</label>
//                 <input
//                   className={`${styles.input} ${
//                     errors.alias ? styles.errorInput : ''
//                   }`}
//                   {...register('alias', {
//                     required: 'Обовʼязково',
//                     pattern: {
//                       value: /^[a-z0-9-]+$/,
//                       message:
//                         'Тільки маленькі латинські літери, цифри та дефіс',
//                     },
//                     maxLength: {
//                       value: 100,
//                       message: 'Занадто довгий alias',
//                     },
//                   })}
//                   placeholder="badmik-kyiv"
//                 />
//                 {errors.alias && (
//                   <p className={styles.errorText}>
//                     {errors.alias.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* 2 ряд: Місто / Адреса */}
//             <div className={styles.formGrid}>
//               <div>
//                 <label className={styles.label}>МІСТО *</label>
//                 <input
//                   className={`${styles.input} ${
//                     errors.city ? styles.errorInput : ''
//                   }`}
//                   {...register('city', {
//                     required: 'Обовʼязково',
//                     maxLength: {
//                       value: 100,
//                       message: 'Занадто довга назва міста',
//                     },
//                   })}
//                   placeholder="Київ"
//                 />
//                 {errors.city && (
//                   <p className={styles.errorText}>
//                     {errors.city.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className={styles.label}>АДРЕСА *</label>
//                 <input
//                   className={`${styles.input} ${
//                     errors.address ? styles.errorInput : ''
//                   }`}
//                   {...register('address', {
//                     required: 'Обовʼязково',
//                     maxLength: {
//                       value: 200,
//                       message: 'Занадто довга адреса',
//                     },
//                   })}
//                   placeholder="вул. Спортивна, 10"
//                 />
//                 {errors.address && (
//                   <p className={styles.errorText}>
//                     {errors.address.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* 3 ряд: Email / Телефон */}
//             <div className={styles.formGrid}>
//               <div>
//                 <label className={styles.label}>EMAIL</label>
//                 <input
//                   className={`${styles.input} ${
//                     errors.email ? styles.errorInput : ''
//                   }`}
//                   type="email"
//                   {...register('email', {
//                     pattern: {
//                       value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                       message: 'Некоректний email',
//                     },
//                     maxLength: {
//                       value: 254,
//                       message: 'Занадто довгий email',
//                     },
//                   })}
//                   placeholder="info@badmik.ua"
//                 />
//                 {errors.email && (
//                   <p className={styles.errorText}>
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className={styles.label}>ТЕЛЕФОН</label>
//                 <input
//                   className={`${styles.input} ${
//                     errors.phone ? styles.errorInput : ''
//                   }`}
//                   type="tel"
//                   {...register('phone', {
//                     maxLength: {
//                       value: 50,
//                       message: 'Занадто довгий номер',
//                     },
//                   })}
//                   placeholder="+380 67 000 00 00"
//                 />
//                 {errors.phone && (
//                   <p className={styles.errorText}>
//                     {errors.phone.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Website */}
//             <div>
//               <label className={styles.label}>WEBSITE</label>
//               <input
//                 className={`${styles.input} ${
//                   errors.website ? styles.errorInput : ''
//                 }`}
//                 {...register('website', {
//                   pattern: {
//                     value: /^$|^https?:\/\/.+$/i,
//                     message: 'Почни з http:// або https://',
//                   },
//                   maxLength: {
//                     value: 300,
//                     message: 'Занадто довгий URL',
//                   },
//                 })}
//                 placeholder="https://badmik.ua"
//               />
//               {errors.website && (
//                 <p className={styles.errorText}>
//                   {errors.website.message}
//                 </p>
//               )}
//             </div>

//             {/* Опис */}
//             <div>
//               <label className={styles.label}>ОПИС</label>
//               <textarea
//                 className={styles.textarea}
//                 rows={4}
//                 {...register('description', {
//                   maxLength: {
//                     value: 1000,
//                     message: 'Максимум 1000 символів',
//                   },
//                 })}
//                 placeholder="Короткий опис клубу…"
//               />
//               {errors.description && (
//                 <p className={styles.errorText}>
//                   {errors.description.message}
//                 </p>
//               )}
//             </div>

//             {/* Нижній ряд: чекбокс + порядок */}
//             <div className={styles.bottomRow}>
//               <label className={styles.checkboxLabel}>
//                 <input type="checkbox" {...register('isActive')} />
//                 <span>Клуб активний</span>
//               </label>

//               <div className={styles.orderField}>
//                 <span className={styles.labelInline}>Порядок:</span>
//                 <input
//                   type="number"
//                   min={1}
//                   className={`${styles.input} ${styles.orderInput} ${
//                     errors.sortOrder ? styles.errorInput : ''
//                   }`}
//                   {...register('sortOrder', {
//                     required: 'Обовʼязково',
//                     min: {
//                       value: 1,
//                       message: 'Мінімум 1',
//                     },
//                     valueAsNumber: true,
//                   })}
//                   onWheel={(e) => e.currentTarget.blur()}
//                 />
//                 {errors.sortOrder && (
//                   <p className={styles.errorText}>
//                     {errors.sortOrder.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </form>
//         </ScrollArea>
//       </div>

    
//        {busy && <SpinnerOverlay fullscreen={false} />}
//     </div>
//   );
// });

// export default ClubForm;


