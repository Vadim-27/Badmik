// 'use client';

// import * as React from 'react';
// import { useForm } from 'react-hook-form';
// import styles from './AddClubForm.module.scss';

// type Currency = 'UAH' | 'EUR' | 'USD';

// type ClubFormValues = {
//   id: string;
//   name: string;
//   badge?: string;             // напр.: "Топ" (optional)
//   city: string;
//   address: string;
//   description?: string;
//   features: {
//     courts: number;
//     flooring?: string;
//     parking: boolean;
//     water: boolean;
//     airConditioning: boolean;
//   };
//   priceFrom: number;
//   currency: Currency;
//   image?: string;             // URL або шлях /clubs/...
//   detailsUrl: string;         // бажано /clubs/slug
// };

// type Props = {
//   mode?: 'create' | 'edit';
//   defaultValues?: Partial<ClubFormValues>;
//   onSubmit: (data: ClubFormValues) => Promise<void>;
// };

// export default function AddClubForm ({ mode = 'create', defaultValues, onSubmit }: Props) {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<ClubFormValues>({
//     mode: 'all',
//     defaultValues: {
      
//       name: '',
//       badge: '',
//       city: '',
//       address: '',
//       description: '',
//       features: {
//         courts: 1,
//         flooring: '',
//         parking: false,
//         water: false,
//         airConditioning: false,
//       },
//       priceFrom: 0,
//       currency: 'UAH',
//       image: '',
//     //   detailsUrl: '/clubs/',
//       ...defaultValues,
//     },
//   });

//   // прикольчик: якщо користувач вводить name — автопропонуємо id/slug
//   const name = watch('name');
//   React.useEffect(() => {
//     if (!defaultValues?.id) {
//       const slug = name
//         ?.toLowerCase()
//         .replace(/[^\p{L}\p{N}]+/gu, '-')
//         .replace(/^-+|-+$/g, '');
//       if (slug) setValue('id', slug, { shouldValidate: true });
//       if (slug && !defaultValues?.detailsUrl) {
//         setValue('detailsUrl', `/clubs/${slug}`, { shouldValidate: true });
//       }
//     }
//   }, [name, defaultValues?.id, defaultValues?.detailsUrl, setValue]);

//   const onSubmitInternal = async (data: ClubFormValues) => {
//     // нормалізації
//     data.features.courts = Number(data.features.courts);
//     data.priceFrom = Number(data.priceFrom);

//     await onSubmit(data);
//   };

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.formBox}>
        

//         <form onSubmit={handleSubmit(onSubmitInternal)} className={styles.form}>
//           {/* ID */}
//           {/* <div>
//             <label className={styles.label}>ID клубу (slug)</label>
//             <input
//               className={`${styles.input} ${errors.id ? styles.errorInput : ''}`}
//               placeholder="club1 або sport-life-pozn"
//               {...register('id', {
//                 required: 'Обовʼязково',
//                 pattern: {
//                   value: /^[a-zA-Z0-9-_]+$/,
//                   message: 'Тільки латиниця, цифри, дефіс або підкреслення',
//                 },
//                 minLength: { value: 3, message: 'Мінімум 3 символи' },
//               })}
//             />
//             {errors.id && <p className={styles.errorText}>{errors.id.message}</p>}
//             <p className={styles.help}>Використовується у шляхах та як унікальний ключ.</p>
//           </div> */}

//           {/* Name */}
//           <div>
//             <label className={styles.label}>Назва</label>
//             <input
//               className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
//               placeholder="Sport Life Позняки"
//               {...register('name', {
//                 required: 'Обовʼязково',
//                 minLength: { value: 3, message: 'Мінімум 3 символи' },
//               })}
//             />
//             {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
//           </div>

//           {/* Badge (optional) */}
//           <div>
//             <label className={styles.label}>Бейдж (необовʼязково)</label>
//             <select
//               className={styles.select}
//               {...register('badge')}
//             >
//               <option value="">— без бейджа —</option>
//               <option value="Топ">Топ</option>
//               <option value="Популярний">Популярний</option>
//               <option value="Новий">Новий</option>
//             </select>
//           </div>

//           {/* City & Address */}
//           <div className={styles.row2}>
//             <div>
//               <label className={styles.label}>Місто</label>
//               <input
//                 className={`${styles.input} ${errors.city ? styles.errorInput : ''}`}
//                 placeholder="Київ"
//                 {...register('city', { required: 'Обовʼязково' })}
//               />
//               {errors.city && <p className={styles.errorText}>{errors.city.message}</p>}
//             </div>
//             <div>
//               <label className={styles.label}>Адреса</label>
//               <input
//                 className={`${styles.input} ${errors.address ? styles.errorInput : ''}`}
//                 placeholder="вулиця М. Драгоманова, 40Г, Київ"
//                 {...register('address', { required: 'Обовʼязково' })}
//               />
//               {errors.address && <p className={styles.errorText}>{errors.address.message}</p>}
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <label className={styles.label}>Опис</label>
//             <textarea
//               rows={4}
//               className={styles.textarea}
//               placeholder="Короткий опис клубу…"
//               {...register('description', {
//                 maxLength: { value: 600, message: 'До 600 символів' },
//               })}
//             />
//             {errors.description && (
//               <p className={styles.errorText}>{errors.description.message}</p>
//             )}
//           </div>

//           {/* Features */}
//           <div>
//             <label className={styles.label}>Можливості</label>
//             <div className={styles.row2}>
//               <div>
//                 <label className={styles.label}>Кількість кортів</label>
//                 <input
//                   type="number"
//                   min={1}
//                   className={`${styles.input} ${errors?.features?.courts ? styles.errorInput : ''}`}
//                   {...register('features.courts', {
//                     required: 'Обовʼязково',
//                     min: { value: 1, message: 'Мінімум 1 корт' },
//                     validate: (v) =>
//                       Number.isInteger(Number(v)) || 'Лише ціле число',
//                     valueAsNumber: true,
//                   })}
//                   onWheel={(e) => e.currentTarget.blur()}
//                 />
//                 {errors?.features?.courts && (
//                   <p className={styles.errorText}>{errors.features.courts.message as string}</p>
//                 )}
//               </div>
//               <div>
//                 <label className={styles.label}>Покриття підлоги</label>
//                 <input
//                   className={styles.input}
//                   placeholder="Вінілове покриття"
//                   {...register('features.flooring')}
//                 />
//               </div>
//             </div>

//            <div className={styles.switchBox}>
//             <div className={styles.switchRow}>
//               <label className={styles.switch}>
//                 <input type="checkbox" {...register('features.parking')} />
//               </label>
//               <span>Паркування</span>
//             </div>
//             <div className={styles.switchRow}>
//               <label className={styles.switch}>
//                 <input type="checkbox" {...register('features.water')} />
//               </label>
//               <span>Вода</span>
//             </div>
//             <div className={styles.switchRow}>
//               <label className={styles.switch}>
//                 <input type="checkbox" {...register('features.airConditioning')} />
//               </label>
//               <span>Кондиціонування</span>
//             </div>
//             </div>
//           </div>

//           {/* Pricing */}
//           <div className={styles.row2}>
//             <div>
//               <label className={styles.label}>Ціна від</label>
//               <input
//                 type="number"
//                 min={0}
//                 className={`${styles.input} ${errors.priceFrom ? styles.errorInput : ''}`}
//                 {...register('priceFrom', {
//                   required: 'Обовʼязково',
//                   min: { value: 0, message: 'Не може бути відʼємною' },
//                   valueAsNumber: true,
//                 })}
//                 onWheel={(e) => e.currentTarget.blur()}
//               />
//               {errors.priceFrom && (
//                 <p className={styles.errorText}>{errors.priceFrom.message}</p>
//               )}
//             </div>

//             <div>
//               <label className={styles.label}>Валюта</label>
//               <select
//                 className={`${styles.select} ${errors.currency ? styles.errorInput : ''}`}
//                 {...register('currency', { required: 'Обовʼязково' })}
//               >
//                 <option value="UAH">UAH</option>
//                 <option value="EUR">EUR</option>
//                 <option value="USD">USD</option>
//               </select>
//               {errors.currency && (
//                 <p className={styles.errorText}>{errors.currency.message}</p>
//               )}
//             </div>
//           </div>

//           {/* Media & URL */}
//           <div>
//             <label className={styles.label}>Зображення (URL або шлях)</label>
//             <input
//               className={`${styles.input} ${errors.image ? styles.errorInput : ''}`}
//               placeholder="/clubs/club1.jpg або https://…"
//               {...register('image', {
//                 pattern: {
//                   value: /^(\/|https?:\/\/).*/i,
//                   message: 'Починай з / або http(s)://',
//                 },
//               })}
//             />
//             {errors.image && <p className={styles.errorText}>{errors.image.message}</p>}
//           </div>

//            {/* <div>
//             <label className={styles.label}>URL сторінки клубу</label>
//             <input
//               className={`${styles.input} ${errors.detailsUrl ? styles.errorInput : ''}`}
//               placeholder="/clubs/club1"
//               {...register('detailsUrl', {
//                 required: 'Обовʼязково',
//                 pattern: {
//                   value: /^\/., */}
// {/* 
//                    message: 'Повинен починатися з /',
//                  },
//                  minLength: { value: 6, message: 'Закороткий шлях' },
//                })}
//              />
//              {errors.detailsUrl && (
//                <p className={styles.errorText}>{errors.detailsUrl.message}</p>
//              )}
//              <p className={styles.help}>Напр.: /clubs/{'{'}id{'}'} або /clubs/club1</p>
//            </div>  */}

//           {/* <button type="submit" disabled={isSubmitting} className={styles.button}>
//             {mode === 'create' ? 'Створити клуб' : 'Зберегти клуб'}
//           </button> */}
//         </form>
//       </div>
//     </div>
//   );
// }




//================================================


'use client';

import {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
} from 'react';
import { useForm } from 'react-hook-form';
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

  // включаємо/виключаємо кнопку Save у хедері
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
        sortOrder: Number.isFinite(raw.sortOrder)
          ? Number(raw.sortOrder)
          : 1,
      };

      if (clubId && onSubmitUpdate) {
        await onSubmitUpdate(clubId, normalized);
      } else if (onSubmitCreate) {
        await onSubmitCreate(normalized);
      }

      if (mode === 'create') {
        reset(normalized);
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
                  НАЗВА КЛУБУ *
                </label>
                <input
                  className={`${styles.input} ${
                    errors.name ? styles.errorInput : ''
                  }`}
                  {...register('name', {
                    required: 'Обовʼязково',
                    minLength: {
                      value: 3,
                      message: 'Мінімум 3 символи',
                    },
                    maxLength: {
                      value: 200,
                      message: 'Занадто довга назва',
                    },
                  })}
                  placeholder="Badmik Club Kyiv"
                />
                {errors.name && (
                  <p className={styles.errorText}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className={styles.label}>ALIAS *</label>
                <input
                  className={`${styles.input} ${
                    errors.alias ? styles.errorInput : ''
                  }`}
                  {...register('alias', {
                    required: 'Обовʼязково',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message:
                        'Тільки маленькі латинські літери, цифри та дефіс',
                    },
                    maxLength: {
                      value: 100,
                      message: 'Занадто довгий alias',
                    },
                  })}
                  placeholder="badmik-kyiv"
                />
                {errors.alias && (
                  <p className={styles.errorText}>
                    {errors.alias.message}
                  </p>
                )}
              </div>
            </div>

            {/* 2 ряд: Місто / Адреса */}
            <div className={styles.formGrid}>
              <div>
                <label className={styles.label}>МІСТО *</label>
                <input
                  className={`${styles.input} ${
                    errors.city ? styles.errorInput : ''
                  }`}
                  {...register('city', {
                    required: 'Обовʼязково',
                    maxLength: {
                      value: 100,
                      message: 'Занадто довга назва міста',
                    },
                  })}
                  placeholder="Київ"
                />
                {errors.city && (
                  <p className={styles.errorText}>
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className={styles.label}>АДРЕСА *</label>
                <input
                  className={`${styles.input} ${
                    errors.address ? styles.errorInput : ''
                  }`}
                  {...register('address', {
                    required: 'Обовʼязково',
                    maxLength: {
                      value: 200,
                      message: 'Занадто довга адреса',
                    },
                  })}
                  placeholder="вул. Спортивна, 10"
                />
                {errors.address && (
                  <p className={styles.errorText}>
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {/* 3 ряд: Email / Телефон */}
            <div className={styles.formGrid}>
              <div>
                <label className={styles.label}>EMAIL</label>
                <input
                  className={`${styles.input} ${
                    errors.email ? styles.errorInput : ''
                  }`}
                  type="email"
                  {...register('email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Некоректний email',
                    },
                    maxLength: {
                      value: 254,
                      message: 'Занадто довгий email',
                    },
                  })}
                  placeholder="info@badmik.ua"
                />
                {errors.email && (
                  <p className={styles.errorText}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className={styles.label}>ТЕЛЕФОН</label>
                <input
                  className={`${styles.input} ${
                    errors.phone ? styles.errorInput : ''
                  }`}
                  type="tel"
                  {...register('phone', {
                    maxLength: {
                      value: 50,
                      message: 'Занадто довгий номер',
                    },
                  })}
                  placeholder="+380 67 000 00 00"
                />
                {errors.phone && (
                  <p className={styles.errorText}>
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Website */}
            <div>
              <label className={styles.label}>WEBSITE</label>
              <input
                className={`${styles.input} ${
                  errors.website ? styles.errorInput : ''
                }`}
                {...register('website', {
                  pattern: {
                    value: /^$|^https?:\/\/.+$/i,
                    message: 'Почни з http:// або https://',
                  },
                  maxLength: {
                    value: 300,
                    message: 'Занадто довгий URL',
                  },
                })}
                placeholder="https://badmik.ua"
              />
              {errors.website && (
                <p className={styles.errorText}>
                  {errors.website.message}
                </p>
              )}
            </div>

            {/* Опис */}
            <div>
              <label className={styles.label}>ОПИС</label>
              <textarea
                className={styles.textarea}
                rows={4}
                {...register('description', {
                  maxLength: {
                    value: 1000,
                    message: 'Максимум 1000 символів',
                  },
                })}
                placeholder="Короткий опис клубу…"
              />
              {errors.description && (
                <p className={styles.errorText}>
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Нижній ряд: чекбокс + порядок */}
            <div className={styles.bottomRow}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('isActive')} />
                <span>Клуб активний</span>
              </label>

              <div className={styles.orderField}>
                <span className={styles.labelInline}>Порядок:</span>
                <input
                  type="number"
                  min={1}
                  className={`${styles.input} ${styles.orderInput} ${
                    errors.sortOrder ? styles.errorInput : ''
                  }`}
                  {...register('sortOrder', {
                    required: 'Обовʼязково',
                    min: {
                      value: 1,
                      message: 'Мінімум 1',
                    },
                    valueAsNumber: true,
                  })}
                  onWheel={(e) => e.currentTarget.blur()}
                />
                {errors.sortOrder && (
                  <p className={styles.errorText}>
                    {errors.sortOrder.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </ScrollArea>
      </div>

      {/* {busy && (
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
      )} */}
       {busy && <SpinnerOverlay fullscreen={false} />}
    </div>
  );
});

export default ClubForm;


