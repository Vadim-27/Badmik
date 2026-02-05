// 'use client';

// import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form';
// import { useMemo, useRef, useState } from 'react';
// import styles from './AvatarUploadField.module.scss';

// type Props<TFieldValues extends FieldValues> = {
//   control: Control<TFieldValues>;
//   name: FieldPath<TFieldValues>;

//   // rootClassName?: string;
//   label?: string;
//   accept?: string;          // 'image/*' за замовч.
//   maxSizeMB?: number;       // 5 за замовч.
//   uploadFile: (file: File) => Promise<string>; // має повернути публічний URL
// };

// export default function AvatarUploadField<TFieldValues extends FieldValues>({
//   control,
//   name,
//   // rootClassName,
// //   label = 'Аватар',
//   accept = 'image/*',
//   maxSizeMB = 15,
//   uploadFile,
// }: Props<TFieldValues>) {
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const [localPreview, setLocalPreview] = useState<string | null>(null);
//   const [busy, setBusy] = useState(false);
//   const [localError, setLocalError] = useState<string | null>(null);

//   return (
//     <Controller
//       control={control}
//       name={name}
//       render={({ field, fieldState }) => {
//         // <div className={`${styles.root} ${rootClassName ?? ''}`}>
//         //     {label && <label className={styles.label}>{label}</label>}
//         //     {/* ... решта без змін ... */}
//         //   </div>
//         const value = (field.value as string) || '';   // imageUrl
//         const preview = useMemo(() => localPreview || value || '', [localPreview, value]);

//         const onPick = async (file: File) => {
//           setLocalError(null);
//           if (!file) return;

//           // базова валідація
//           if (accept && !file.type.startsWith('image/')) {
//             setLocalError('Потрібне зображення.');
//             return;
//           }
//           if (file.size > maxSizeMB * 1024 * 1024) {
//             setLocalError(`Максимальний розмір ${maxSizeMB}MB.`);
//             return;
//           }

//           // локальне прев’ю
//           const url = URL.createObjectURL(file);
//           setLocalPreview(url);

//           // завантаження
//           setBusy(true);
//           try {
//             const uploadedUrl = await uploadFile(file);   // ⬅️ ваш аплоадер
//             field.onChange(uploadedUrl);                  // записуємо у imageUrl
//           } catch {
//             setLocalError('Не вдалося завантажити файл.');
//             setLocalPreview(null);
//           } finally {
//             setBusy(false);
//           }
//         };

//         const onRemove = () => {
//           setLocalPreview(null);
//           field.onChange('');
//           if (inputRef.current) inputRef.current.value = '';
//         };

//         return (
//           <div className={styles.root}>
//             {/* {label && <label className={styles.label}>{label}</label>} */}

//             <div className={styles.row}>
//               {/* аватар */}
//               {/* {preview ? (
//                 <img src={preview} alt="Аватар" className={styles.avatar} />
//               ) : (
//                 <div className={`${styles.avatar} ${styles.avatarEmpty}`}>Аватар</div>
//               )} */}

//               <div className={styles.avatarBox}>
//       {preview ? (
//         <img src={preview} alt="Аватар" className={styles.avatarImg} />
//       ) : (
//         <span className={styles.avatarPlaceholder}>Аватар</span>
//       )}
//     </div>

//               {/* кнопки */}
//               <div className={styles.buttons}>
//                 <button
//                   type="button"
//                   className={styles.btn}
//                   onClick={() => inputRef.current?.click()}
//                   disabled={busy}
//                 >
//                   {busy ? 'Завантаження…' : 'Завантажити'}
//                 </button>
//                 <button
//                   type="button"
//                   className={styles.btnGhost}
//                   onClick={onRemove}
//                   disabled={busy || (!preview && !value)}
//                 >
//                   Прибрати
//                 </button>
//               </div>
//             </div>

//             <input
//               ref={inputRef}
//               type="file"
//               accept={accept}
//               hidden
//               onChange={(e) => {
//                 const f = e.target.files?.[0];
//                 if (f) onPick(f);
//               }}
//             />

//             {(fieldState.error || localError) && (
//               <p className={styles.errorText}>
//                 {fieldState.error?.message ?? localError}
//               </p>
//             )}
//           </div>
//         );
//       }}
//     />
//   );
// }



'use client';

import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form';
import { useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './AvatarUploadField.module.scss';


type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;

  label?: string;
  accept?: string;
  maxSizeMB?: number;
  uploadFile: (file: File) => Promise<string>;
};

export default function AvatarUploadField<TFieldValues extends FieldValues>({
  control,
  name,
  accept = 'image/*',
  maxSizeMB = 15,
  uploadFile,
}: Props<TFieldValues>) {
  const t = useTranslations('StaffForm.avatar');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = (field.value as string) || '';
        const preview = useMemo(() => localPreview || value || '', [localPreview, value]);

        const onPick = async (file: File) => {
          setLocalError(null);
          if (!file) return;

          // базова валідація
          if (accept && !file.type.startsWith('image/')) {
            setLocalError(t('errors.notImage'));
            return;
          }
          if (file.size > maxSizeMB * 1024 * 1024) {
            setLocalError(t('errors.tooLarge', { max: maxSizeMB }));
            return;
          }

          const url = URL.createObjectURL(file);
          setLocalPreview(url);

          setBusy(true);
          try {
            const uploadedUrl = await uploadFile(file);
            field.onChange(uploadedUrl);
          } catch {
            setLocalError(t('errors.uploadFailed'));
            setLocalPreview(null);
          } finally {
            setBusy(false);
          }
        };

        const onRemove = () => {
          setLocalPreview(null);
          field.onChange('');
          if (inputRef.current) inputRef.current.value = '';
        };

        return (
          <div className={styles.root}>
            <div className={styles.row}>
              <div className={styles.avatarBox}>
                {preview ? (
                  <img src={preview} alt={t('alt')} className={styles.avatarImg} />
                ) : (
                  <span className={styles.avatarPlaceholder}>{t('placeholder')}</span>
                )}
              </div>

              <div className={styles.buttons}>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => inputRef.current?.click()}
                  disabled={busy}
                >
                  {busy ? t('uploading') : t('upload')}
                </button>

                <button
                  type="button"
                  className={styles.btnGhost}
                  onClick={onRemove}
                  disabled={busy || (!preview && !value)}
                >
                  {t('remove')}
                </button>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={accept}
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPick(f);
              }}
            />

            {(fieldState.error || localError) && (
              <p className={styles.errorText}>{fieldState.error?.message ?? localError}</p>
            )}
          </div>
        );
      }}
    />
  );
}

