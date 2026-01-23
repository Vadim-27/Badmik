


'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import styles from './AppModal.module.scss';

type Props = {
  open: boolean;
  title?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
  busy?: boolean; // щоб можна було заборонити закриття як в PasswordChangeModal
  subtitle?: React.ReactNode;
};

export default function AppModal({
  open,
  title,
  subtitle,
  onClose,
  children,
  maxWidth = 680,
  busy,
}: Props) {
  // ESC + overlay close дає HeadlessUI, але ми блокуємо якщо busy
  const safeClose = busy ? () => {} : onClose;

  useEffect(() => {
    if (!open) return;
    // на всяк випадок - фікс скролу
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.root} onClose={safeClose}>
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
            <Dialog.Panel className={styles.modal} style={{ width: maxWidth }}>
              <div className={styles.header}>
                <div>
                  {title ? (
                    <Dialog.Title className={styles.titleRow}>{title}</Dialog.Title>
                  ) : null}
                  {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
                </div>

                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={onClose}
                  disabled={Boolean(busy)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className={styles.body}>{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

