'use client';

import React from 'react';
import css from './SaveButton.module.scss';
import { useTranslations } from 'next-intl';

type SaveButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  form?: string
};

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, disabled, label = 'Зберегти' }) => {
  const tUI = useTranslations('UI');
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={css.saveButton}
    >
      {tUI(label)}
    </button>
  );
};

export default SaveButton;

// app/components/ui/Buttons/SaveButton/SaveButton.tsx
// 'use client';

// import React, { useCallback } from 'react';
// import css from './SaveButton.module.scss';
// import { useTranslations } from 'next-intl';

// type SaveButtonProps = {
//   label?: string;
//   form?: string;         // id форми, яку треба сабмітити
//   disabled?: boolean;
// };

// export default function SaveButton({ label = 'Save', form, disabled }: SaveButtonProps) {
//   const tUI = useTranslations('UI');

//   const handleClick = useCallback(() => {
//     if (!form) {
//       console.warn('SaveButton: no form id provided');
//       return;
//     }

//     const f = document.getElementById(form) as HTMLFormElement | null;
//     if (!f) {
//       console.warn('SaveButton: form not found:', form);
//       return;
//     }

//     // Додаємо одноразовий listener, який перед сабмітом виведе дані в консоль
//     const onSubmit = (ev: Event) => {
//       try {
//         const fd = new FormData(f);
//         // Збираємо всі значення (групуємо однакові ключі в масив)
//         const out: Record<string, any> = {};
//         for (const [k, v] of fd.entries()) {
//           if (out[k] === undefined) out[k] = v;
//           else if (Array.isArray(out[k])) out[k].push(v);
//           else out[k] = [out[k], v];
//         }
//         console.log('SaveButton submit — form data:', out);
//       } catch (err) {
//         console.error('SaveButton: failed to read form data', err);
//       } finally {
//         f.removeEventListener('submit', onSubmit);
//       }
//       // не виконуємо preventDefault — даємо формі/React обробити сабміт як зазвичай
//     };

//     f.addEventListener('submit', onSubmit);
//     // викликаємо браузерний submit (валидація HTML буде виконана)
//     f.requestSubmit();
//   }, [form]);

//   return (
//     <button
//       type="button"
//       onClick={handleClick}
//       disabled={disabled}
//       className={css.saveButton}
//     >
//       {tUI(label)}
//     </button>
//   );
// }

