'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import styles from './AddClubForm.module.scss';

type Currency = 'UAH' | 'EUR' | 'USD';

type ClubFormValues = {
  id: string;
  name: string;
  badge?: string;             // напр.: "Топ" (optional)
  city: string;
  address: string;
  description?: string;
  features: {
    courts: number;
    flooring?: string;
    parking: boolean;
    water: boolean;
    airConditioning: boolean;
  };
  priceFrom: number;
  currency: Currency;
  image?: string;             // URL або шлях /clubs/...
  detailsUrl: string;         // бажано /clubs/slug
};

type Props = {
  mode?: 'create' | 'edit';
  defaultValues?: Partial<ClubFormValues>;
  onSubmit: (data: ClubFormValues) => Promise<void>;
};

export default function AddClubForm ({ mode = 'create', defaultValues, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClubFormValues>({
    mode: 'all',
    defaultValues: {
      
      name: '',
      badge: '',
      city: '',
      address: '',
      description: '',
      features: {
        courts: 1,
        flooring: '',
        parking: false,
        water: false,
        airConditioning: false,
      },
      priceFrom: 0,
      currency: 'UAH',
      image: '',
    //   detailsUrl: '/clubs/',
      ...defaultValues,
    },
  });

  // прикольчик: якщо користувач вводить name — автопропонуємо id/slug
  const name = watch('name');
  React.useEffect(() => {
    if (!defaultValues?.id) {
      const slug = name
        ?.toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, '');
      if (slug) setValue('id', slug, { shouldValidate: true });
      if (slug && !defaultValues?.detailsUrl) {
        setValue('detailsUrl', `/clubs/${slug}`, { shouldValidate: true });
      }
    }
  }, [name, defaultValues?.id, defaultValues?.detailsUrl, setValue]);

  const onSubmitInternal = async (data: ClubFormValues) => {
    // нормалізації
    data.features.courts = Number(data.features.courts);
    data.priceFrom = Number(data.priceFrom);

    await onSubmit(data);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formBox}>
        

        <form onSubmit={handleSubmit(onSubmitInternal)} className={styles.form}>
          {/* ID */}
          {/* <div>
            <label className={styles.label}>ID клубу (slug)</label>
            <input
              className={`${styles.input} ${errors.id ? styles.errorInput : ''}`}
              placeholder="club1 або sport-life-pozn"
              {...register('id', {
                required: 'Обовʼязково',
                pattern: {
                  value: /^[a-zA-Z0-9-_]+$/,
                  message: 'Тільки латиниця, цифри, дефіс або підкреслення',
                },
                minLength: { value: 3, message: 'Мінімум 3 символи' },
              })}
            />
            {errors.id && <p className={styles.errorText}>{errors.id.message}</p>}
            <p className={styles.help}>Використовується у шляхах та як унікальний ключ.</p>
          </div> */}

          {/* Name */}
          <div>
            <label className={styles.label}>Назва</label>
            <input
              className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
              placeholder="Sport Life Позняки"
              {...register('name', {
                required: 'Обовʼязково',
                minLength: { value: 3, message: 'Мінімум 3 символи' },
              })}
            />
            {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
          </div>

          {/* Badge (optional) */}
          <div>
            <label className={styles.label}>Бейдж (необовʼязково)</label>
            <select
              className={styles.select}
              {...register('badge')}
            >
              <option value="">— без бейджа —</option>
              <option value="Топ">Топ</option>
              <option value="Популярний">Популярний</option>
              <option value="Новий">Новий</option>
            </select>
          </div>

          {/* City & Address */}
          <div className={styles.row2}>
            <div>
              <label className={styles.label}>Місто</label>
              <input
                className={`${styles.input} ${errors.city ? styles.errorInput : ''}`}
                placeholder="Київ"
                {...register('city', { required: 'Обовʼязково' })}
              />
              {errors.city && <p className={styles.errorText}>{errors.city.message}</p>}
            </div>
            <div>
              <label className={styles.label}>Адреса</label>
              <input
                className={`${styles.input} ${errors.address ? styles.errorInput : ''}`}
                placeholder="вулиця М. Драгоманова, 40Г, Київ"
                {...register('address', { required: 'Обовʼязково' })}
              />
              {errors.address && <p className={styles.errorText}>{errors.address.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={styles.label}>Опис</label>
            <textarea
              rows={4}
              className={styles.textarea}
              placeholder="Короткий опис клубу…"
              {...register('description', {
                maxLength: { value: 600, message: 'До 600 символів' },
              })}
            />
            {errors.description && (
              <p className={styles.errorText}>{errors.description.message}</p>
            )}
          </div>

          {/* Features */}
          <div>
            <label className={styles.label}>Можливості</label>
            <div className={styles.row2}>
              <div>
                <label className={styles.label}>Кількість кортів</label>
                <input
                  type="number"
                  min={1}
                  className={`${styles.input} ${errors?.features?.courts ? styles.errorInput : ''}`}
                  {...register('features.courts', {
                    required: 'Обовʼязково',
                    min: { value: 1, message: 'Мінімум 1 корт' },
                    validate: (v) =>
                      Number.isInteger(Number(v)) || 'Лише ціле число',
                    valueAsNumber: true,
                  })}
                  onWheel={(e) => e.currentTarget.blur()}
                />
                {errors?.features?.courts && (
                  <p className={styles.errorText}>{errors.features.courts.message as string}</p>
                )}
              </div>
              <div>
                <label className={styles.label}>Покриття підлоги</label>
                <input
                  className={styles.input}
                  placeholder="Вінілове покриття"
                  {...register('features.flooring')}
                />
              </div>
            </div>

           <div className={styles.switchBox}>
            <div className={styles.switchRow}>
              <label className={styles.switch}>
                <input type="checkbox" {...register('features.parking')} />
              </label>
              <span>Паркування</span>
            </div>
            <div className={styles.switchRow}>
              <label className={styles.switch}>
                <input type="checkbox" {...register('features.water')} />
              </label>
              <span>Вода</span>
            </div>
            <div className={styles.switchRow}>
              <label className={styles.switch}>
                <input type="checkbox" {...register('features.airConditioning')} />
              </label>
              <span>Кондиціонування</span>
            </div>
            </div>
          </div>

          {/* Pricing */}
          <div className={styles.row2}>
            <div>
              <label className={styles.label}>Ціна від</label>
              <input
                type="number"
                min={0}
                className={`${styles.input} ${errors.priceFrom ? styles.errorInput : ''}`}
                {...register('priceFrom', {
                  required: 'Обовʼязково',
                  min: { value: 0, message: 'Не може бути відʼємною' },
                  valueAsNumber: true,
                })}
                onWheel={(e) => e.currentTarget.blur()}
              />
              {errors.priceFrom && (
                <p className={styles.errorText}>{errors.priceFrom.message}</p>
              )}
            </div>

            <div>
              <label className={styles.label}>Валюта</label>
              <select
                className={`${styles.select} ${errors.currency ? styles.errorInput : ''}`}
                {...register('currency', { required: 'Обовʼязково' })}
              >
                <option value="UAH">UAH</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
              {errors.currency && (
                <p className={styles.errorText}>{errors.currency.message}</p>
              )}
            </div>
          </div>

          {/* Media & URL */}
          <div>
            <label className={styles.label}>Зображення (URL або шлях)</label>
            <input
              className={`${styles.input} ${errors.image ? styles.errorInput : ''}`}
              placeholder="/clubs/club1.jpg або https://…"
              {...register('image', {
                pattern: {
                  value: /^(\/|https?:\/\/).*/i,
                  message: 'Починай з / або http(s)://',
                },
              })}
            />
            {errors.image && <p className={styles.errorText}>{errors.image.message}</p>}
          </div>

           {/* <div>
            <label className={styles.label}>URL сторінки клубу</label>
            <input
              className={`${styles.input} ${errors.detailsUrl ? styles.errorInput : ''}`}
              placeholder="/clubs/club1"
              {...register('detailsUrl', {
                required: 'Обовʼязково',
                pattern: {
                  value: /^\/., */}
{/* 
                   message: 'Повинен починатися з /',
                 },
                 minLength: { value: 6, message: 'Закороткий шлях' },
               })}
             />
             {errors.detailsUrl && (
               <p className={styles.errorText}>{errors.detailsUrl.message}</p>
             )}
             <p className={styles.help}>Напр.: /clubs/{'{'}id{'}'} або /clubs/club1</p>
           </div>  */}

          {/* <button type="submit" disabled={isSubmitting} className={styles.button}>
            {mode === 'create' ? 'Створити клуб' : 'Зберегти клуб'}
          </button> */}
        </form>
      </div>
    </div>
  );
}
