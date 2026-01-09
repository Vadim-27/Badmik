// 'use client';

// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment, useEffect, useMemo, useState } from 'react';
// import clsx from 'clsx';
// import styles from './PasswordChangeModal.module.scss';

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (password: string) => Promise<void> | void;

//   busy?: boolean;
//   staffEmail?: string | null; // опціонально, щоб показати кому міняємо
// };

// const hasDigit = /\d/;
// const hasUpper = /[A-Z]/;
// const hasLower = /[a-z]/;
// const hasSpecial = /[!@#$%^&*()_+\-=[\]{}|;':",.<>?/`~]/;
// const noWhitespace = /^\S+$/;

// function validatePassword(pw: string) {
//   const v = pw ?? '';
//   if (!v) return 'Введіть пароль.';
//   if (v.length < 8) return 'Мінімум 8 символів.';
//   if (v.length > 64) return 'Максимум 64 символи.';
//   if (!noWhitespace.test(v)) return 'Без пробілів.';
//   if (!hasDigit.test(v)) return 'Має містити цифру.';
//   if (!hasUpper.test(v)) return 'Має містити велику літеру.';
//   if (!hasLower.test(v)) return 'Має містити малу літеру.';
//   if (!hasSpecial.test(v)) return 'Має містити спецсимвол.';
//   return null;
// }

// export default function PasswordChangeModal({
//   open,
//   onClose,
//   onSubmit,
//   busy = false,
//   staffEmail,
// }: Props) {
//   const [pw1, setPw1] = useState('');
//   const [pw2, setPw2] = useState('');
//   const [show1, setShow1] = useState(false);
//   const [show2, setShow2] = useState(false);

//   const pw1Error = useMemo(() => validatePassword(pw1), [pw1]);
//   const pw2Error = useMemo(() => {
//     if (!pw2) return 'Підтвердіть пароль.';
//     if (pw1 && pw2 && pw1 !== pw2) return 'Паролі не співпадають.';
//     return null;
//   }, [pw1, pw2]);

//   const canSave = !busy && !pw1Error && !pw2Error;

//   useEffect(() => {
//     if (!open) {
//       setPw1('');
//       setPw2('');
//       setShow1(false);
//       setShow2(false);
//     }
//   }, [open]);

//   const handleSave = async () => {
//     if (!canSave) return;
//     await onSubmit(pw1);
//   };

//   return (
//     <Transition show={open} as={Fragment}>
//       <Dialog as="div" className={styles.root} onClose={busy ? () => {} : onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-150"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-120"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className={styles.backdrop} />
//         </Transition.Child>

//         <div className={styles.container}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-150"
//             enterFrom="opacity-0 translate-y-2 scale-[0.98]"
//             enterTo="opacity-100 translate-y-0 scale-100"
//             leave="ease-in duration-120"
//             leaveFrom="opacity-100 translate-y-0 scale-100"
//             leaveTo="opacity-0 translate-y-2 scale-[0.98]"
//           >
//             <Dialog.Panel className={styles.modal}>
//               <div className={styles.header}>
//                 <div>
//                   <Dialog.Title className={styles.title}>Змінити пароль</Dialog.Title>
//                   {staffEmail && <div className={styles.subtitle}>{staffEmail}</div>}
//                 </div>

//                 <button
//                   type="button"
//                   className={styles.iconBtn}
//                   onClick={onClose}
//                   disabled={busy}
//                   aria-label="Закрити"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className={styles.body}>
//                 <div className={styles.field}>
//                   <label className={styles.label}>Новий пароль</label>
//                   <div className={styles.inputRow}>
//                     <input
//                       className={clsx(styles.input, pw1Error && styles.errorInput)}
//                       type={show1 ? 'text' : 'password'}
//                       value={pw1}
//                       onChange={(e) => setPw1(e.target.value)}
//                       autoComplete="new-password"
//                       disabled={busy}
//                       placeholder="Введіть новий пароль"
//                     />
//                     <button
//                       type="button"
//                       className={styles.ghostBtn}
//                       onClick={() => setShow1((s) => !s)}
//                       disabled={busy}
//                     >
//                       {show1 ? 'Сховати' : 'Показати'}
//                     </button>
//                   </div>
//                   {pw1Error && <p className={styles.errorText}>{pw1Error}</p>}
//                 </div>

//                 <div className={styles.field}>
//                   <label className={styles.label}>Підтвердіть пароль</label>
//                   <div className={styles.inputRow}>
//                     <input
//                       className={clsx(styles.input, pw2Error && styles.errorInput)}
//                       type={show2 ? 'text' : 'password'}
//                       value={pw2}
//                       onChange={(e) => setPw2(e.target.value)}
//                       autoComplete="new-password"
//                       disabled={busy}
//                       placeholder="Повторіть пароль"
//                     />
//                     <button
//                       type="button"
//                       className={styles.ghostBtn}
//                       onClick={() => setShow2((s) => !s)}
//                       disabled={busy}
//                     >
//                       {show2 ? 'Сховати' : 'Показати'}
//                     </button>
//                   </div>
//                   {pw2Error && <p className={styles.errorText}>{pw2Error}</p>}
//                 </div>

//                 <div className={styles.rules}>
//                   <div className={styles.rulesTitle}>Пароль має містити:</div>
//                   <ul className={styles.rulesList}>
//                     <li>8+ символів</li>
//                     <li>велику і малу літери</li>
//                     <li>цифру</li>
//                     <li>спецсимвол</li>
//                     <li>без пробілів</li>
//                   </ul>
//                 </div>
//               </div>

//               <div className={styles.footer}>
//                 <button
//                   type="button"
//                   className={styles.buttonGhost}
//                   onClick={onClose}
//                   disabled={busy}
//                 >
//                   Скасувати
//                 </button>

//                 <button
//                   type="button"
//                   className={styles.buttonPrimary}
//                   onClick={handleSave}
//                   disabled={!canSave}
//                 >
//                   {busy ? 'Збереження…' : 'Зберегти'}
//                 </button>
//               </div>
//             </Dialog.Panel>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }

'use client';

import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useEffect, useMemo, useState } from 'react';

import styles from './PasswordChangeModal.module.scss';

// якщо у вас SVGR налаштований:
import EyeOpenRegForm from '@/app/assets/icons/EyeOpenRegForm.svg';
import EyeOffRegForm from '@/app/assets/icons/EyeOffRegForm.svg';
import Info from '@/app/assets/icons/Info.svg';
import Tooltip from '@/app/components/ui/Tooltip/Tooltip';

type Props = {
  open: boolean;
  onClose: () => void;

  email?: string | null;

  busy?: boolean;

  // повертаємо НОВИЙ пароль наверх
  onSubmit: (password: string) => Promise<void> | void;
};

const hasDigit = /\d/;
const hasUpper = /[A-Z]/;
const hasLower = /[a-z]/;
const hasSpecial = /[!@#$%^&*()_+\-=[\]{}|;':",.<>?/`~]/;
const noWhitespace = /^\S+$/;

function validatePassword(v: string): string | null {
  if (!v) return 'Введіть пароль.';
  if (v.length < 8) return 'Мінімум 8 символів.';
  if (v.length > 64) return 'Максимум 64 символи.';
  if (!noWhitespace.test(v)) return 'Без пробілів.';
  if (!hasUpper.test(v)) return 'Додайте велику літеру.';
  if (!hasLower.test(v)) return 'Додайте малу літеру.';
  if (!hasDigit.test(v)) return 'Додайте цифру.';
  if (!hasSpecial.test(v)) return 'Додайте спецсимвол.';
  return null;
}
const PASSWORD_RULES_TEXT = (
  <div>
    <div style={{ fontWeight: 700, marginBottom: 6 }}>Пароль має містити:</div>
    <ul style={{ margin: 0, paddingLeft: 18 }}>
      <li>8+ символів</li>
      <li>велику і малу літери</li>
      <li>цифру</li>
      <li>спецсимвол</li>
      <li>без пробілів</li>
    </ul>
  </div>
);

export default function PasswordChangeModal({ open, onClose, email, busy, onSubmit }: Props) {
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');

  const [pw1Touched, setPw1Touched] = useState(false);
  const [pw2Touched, setPw2Touched] = useState(false);

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const pw1Error = useMemo(() => (pw1Touched ? validatePassword(pw1) : null), [pw1, pw1Touched]);

  const pw2Error = useMemo(() => {
    if (!pw2Touched) return null;
    if (!pw2) return 'Підтвердіть пароль.';
    if (pw1 !== pw2) return 'Паролі не співпадають.';
    return null;
  }, [pw1, pw2, pw2Touched]);

  const canSubmit = useMemo(() => {
    return validatePassword(pw1) === null && pw1 === pw2 && pw2.length > 0;
  }, [pw1, pw2]);

  useEffect(() => {
    if (!open) return;
    // при відкритті модалки — чистимо
    setPw1('');
    setPw2('');
    setPw1Touched(false);
    setPw2Touched(false);
    setShow1(false);
    setShow2(false);
  }, [open]);

  const handleSave = async () => {
    setPw1Touched(true);
    setPw2Touched(true);
    if (!canSubmit) return;

    await onSubmit(pw1);
    onClose();
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.root} onClose={busy ? () => {} : onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-120"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={styles.backdrop} />
        </Transition.Child>

        <div className={styles.container}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 translate-y-2 scale-[0.98]"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-120"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-2 scale-[0.98]"
          >
            <Dialog.Panel className={styles.modal}>
              <div className={styles.header}>
                <div>
                  <Dialog.Title className={styles.titleRow}>
                    <span>Змінити пароль</span>

                    <Tooltip content={PASSWORD_RULES_TEXT} >
                      <button
                        type="button"
                        className={styles.infoBtn}
                        aria-label="Вимоги до пароля"
                      >
                        <Info />
                      </button>
                    </Tooltip>
                  </Dialog.Title>
                  {/* <Dialog.Title className={styles.title}>Змінити пароль</Dialog.Title>
                  <Tooltip content={PASSWORD_RULES_TEXT} >
                    <Info className={styles.infoIcon} />
                  </Tooltip> */}
                  {email ? <div className={styles.subtitle}>{email}</div> : null}
                </div>

                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={onClose}
                  disabled={Boolean(busy)}
                  aria-label="Закрити"
                >
                  ✕
                </button>
              </div>

              <div className={styles.body}>
                {/* Новий пароль */}
                <div className={styles.field}>
                  <label className={styles.label}>Новий пароль</label>

                  <div className={clsx(styles.inputWrap, pw1Touched && pw1Error && styles.error)}>
                    <input
                      type={show1 ? 'text' : 'password'}
                      className={styles.input}
                      value={pw1}
                      onChange={(e) => setPw1(e.target.value)}
                      onBlur={() => setPw1Touched(true)}
                      placeholder="Введіть новий пароль"
                      autoComplete="new-password"
                      disabled={Boolean(busy)}
                    />

                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShow1((v) => !v)}
                      aria-label={show1 ? 'Сховати пароль' : 'Показати пароль'}
                      disabled={Boolean(busy)}
                    >
                      {show1 ? <EyeOffRegForm /> : <EyeOpenRegForm />}
                    </button>
                  </div>

                  {pw1Touched && pw1Error && <p className={styles.errorText}>{pw1Error}</p>}
                </div>

                {/* Підтвердження */}
                <div className={styles.field}>
                  <label className={styles.label}>Підтвердіть пароль</label>

                  <div className={clsx(styles.inputWrap, pw2Touched && pw2Error && styles.error)}>
                    <input
                      type={show2 ? 'text' : 'password'}
                      className={styles.input}
                      value={pw2}
                      onChange={(e) => setPw2(e.target.value)}
                      onBlur={() => setPw2Touched(true)}
                      placeholder="Повторіть пароль"
                      autoComplete="new-password"
                      disabled={Boolean(busy)}
                    />

                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShow2((v) => !v)}
                      aria-label={show2 ? 'Сховати пароль' : 'Показати пароль'}
                      disabled={Boolean(busy)}
                    >
                      {show2 ? <EyeOffRegForm /> : <EyeOpenRegForm />}
                    </button>
                  </div>

                  {pw2Touched && pw2Error && <p className={styles.errorText}>{pw2Error}</p>}
                </div>

                {/* <div className={styles.hintBox}>
                  <div className={styles.hintTitle}>Пароль має містити:</div>
                  <ul className={styles.hintList}>
                    <li>8+ символів</li>
                    <li>велику і малу літери</li>
                    <li>цифру</li>
                    <li>спецсимвол</li>
                    <li>без пробілів</li>
                  </ul>
                </div> */}
              </div>

              <div className={styles.footer}>
                <button
                  type="button"
                  className={styles.btnGhost}
                  onClick={onClose}
                  disabled={Boolean(busy)}
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={handleSave}
                  disabled={!canSubmit || Boolean(busy)}
                >
                  Зберегти
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
