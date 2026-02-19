'use client';

import { useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './AvatarUploader.module.scss';

type Props = {
  value?: string | null;
  accept?: string;
  maxSizeMB?: number;

  onUpload: (file: File) => Promise<string>; // повертає url для preview
  onRemove?: () => Promise<void> | void;

  label?: string;
};

export default function AvatarUploader({
  value,
  accept = 'image/*',
  maxSizeMB = 15,
  onUpload,
  onRemove,
  label,
}: Props) {
  const t = useTranslations('StaffForm.avatar');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const preview = useMemo(() => localPreview || value || '', [localPreview, value]);

  const pick = async (file: File) => {
    setLocalError(null);
    if (!file) return;

    if (accept && !file.type.startsWith('image/')) {
      setLocalError(t('errors.notImage'));
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(t('errors.tooLarge', { max: maxSizeMB }));
      return;
    }

    // локальний preview одразу
    const tmp = URL.createObjectURL(file);
    setLocalPreview(tmp);

    setBusy(true);
    try {
      const uploadedUrl = await onUpload(file);
      // після успішного аплоаду - показуємо реальний url (або залишаємо tmp)
      setLocalPreview(uploadedUrl || tmp);
    } catch {
      setLocalError(t('errors.uploadFailed'));
      setLocalPreview(null);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setLocalError(null);
    setBusy(true);
    try {
      await onRemove?.();
      setLocalPreview(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch {
      setLocalError(t('errors.uploadFailed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.root}>
      {label ? <div className={styles.label}>{label}</div> : null}

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
            onClick={remove}
            disabled={busy || !preview}
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
          if (f) void pick(f);
        }}
      />

      {localError && <p className={styles.errorText}>{localError}</p>}
    </div>
  );
}
