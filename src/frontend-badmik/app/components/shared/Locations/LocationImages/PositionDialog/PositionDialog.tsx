

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './PositionDialog.module.scss';

type Props = {
  open: boolean;

  title?: string;
  message?: string;

  initialValue: number;

  min?: number;
  max?: number;
  step?: number;

  label?: string;
  hint?: string;

  confirmLabel?: string;
  cancelLabel?: string;

  isLoading?: boolean;

  onConfirm: (value: number) => void | Promise<void>;
  onCancel: () => void;
};

export default function PositionDialog({
  open,
  title = 'Зміна позиції',
  message,
  initialValue,

  min = 1,
  max = 999,
  step = 1,
  label = 'Нова позиція',
  hint = 'Введіть число від {min} до {max}',

  confirmLabel = 'Зберегти',
  cancelLabel = 'Скасувати',

  isLoading,
  onConfirm,
  onCancel,
}: Props) {
  const safeInitial = useMemo(() => {
    const v = Number.isFinite(initialValue) ? Number(initialValue) : min;
    return clampInt(v, min, max);
  }, [initialValue, min, max]);

  const [value, setValue] = useState<number>(safeInitial);

  // коли відкрили модалку — підставляємо актуальний initialValue
  useEffect(() => {
    if (!open) return;
    setValue(safeInitial);
  }, [open, safeInitial]);

  // ESC
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onCancel();
      if (e.key === 'Enter' && !isLoading) handleConfirm();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isLoading, onCancel, value, min, max]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) onCancel();
  };

  const handleConfirm = () => {
    const v = clampInt(value, min, max);
    onConfirm(v);
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="position-title">
        {title && (
          <h2 id="position-title" className={styles.title}>
            {title}
          </h2>
        )}

        {message ? <p className={styles.message}>{message}</p> : null}

        <div className={styles.row}>
          <div className={styles.left}>
            <label className={styles.label} htmlFor="position-input">
              {label}
            </label>
            <div className={styles.hint}>
              {hint}
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.inputRow}>
              <input
                id="position-input"
                name="position-input"
                type="number"
                className={styles.input}
                value={Number.isFinite(value) ? value : min}
                min={min}
                max={max}
                step={step}
                onChange={(e) => setValue(Number(e.target.value))}
                disabled={!!isLoading}
              />
              
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={onCancel}
            disabled={!!isLoading}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleConfirm}
            disabled={!!isLoading}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function clampInt(v: number, min: number, max: number) {
  const n = Number.isFinite(v) ? Math.trunc(v) : min;
  return Math.max(min, Math.min(max, n));
}