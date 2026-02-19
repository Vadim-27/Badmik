'use client';

import { useEffect } from 'react';
import styles from './ModalShell.module.scss';

type Props = {
  open: boolean;
  title: string;
  busy?: boolean;
  onClose: () => void;
  onSubmit?: () => void;

  cancelLabel: string;
  submitLabel: string;
  savingLabel?: string;

  children: React.ReactNode;
};

export default function ModalShell({
  open,
  title,
  busy,
  onClose,
  onSubmit,
  cancelLabel,
  submitLabel,
  savingLabel,
  children,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>

          <div className={styles.headerActions}>
            <button className={styles.btnGhost} type="button" onClick={onClose} disabled={busy}>
              {cancelLabel}
            </button>

            <button className={styles.btnPrimary} type="button" onClick={onSubmit} disabled={busy || !onSubmit}>
              {busy ? (savingLabel ?? submitLabel) : submitLabel}
            </button>
          </div>
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
