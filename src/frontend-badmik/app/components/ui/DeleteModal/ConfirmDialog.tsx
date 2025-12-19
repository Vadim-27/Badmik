// import {
//   Dialog,
//   DialogActions,
//   DialogTitle,
//   DialogContent,
//   Button,
//   Typography,
// } from '@mui/material';
// import { useTranslations } from 'next-intl';

// type ConfirmDialogProps = {
//   open: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   title?: string;
//   description?: string;
// };

// export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
//   open,
//   onClose,
//   onConfirm,
//   title = 'Підтвердження',
//   description = 'Ви дійсно хочете видалити?',
// }) => {

//   const t = useTranslations('ConfirmDialog');
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>{title}</DialogTitle>
//       <DialogContent>
//         <Typography>{description}</Typography>
//       </DialogContent>
//       <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: 2  }}>
//         <Button onClick={onConfirm} color="error" variant="contained">{t('confirm')}</Button>
//         <Button onClick={onClose} variant="outlined">{t('cancel')}</Button>
        
//       </DialogActions>
//     </Dialog>
//   );
// };

'use client';

import { useEffect } from 'react';
import styles from './ConfirmDialog.module.scss';

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

const ConfirmDialog = ({
  open,
  title = 'Підтвердження',
  message,
  confirmLabel = 'Так',
  cancelLabel = 'Ні',
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel, isLoading]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        {title && (
          <h2 id="confirm-title" className={styles.title}>
            {title}
          </h2>
        )}

        <p className={styles.message}>{message}</p>

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
            onClick={onConfirm}
            disabled={!!isLoading}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

