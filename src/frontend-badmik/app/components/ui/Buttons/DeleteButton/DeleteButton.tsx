'use client';

import styles from './DeleteButton.module.scss';
import { useTranslations } from 'next-intl';

type DeleteButtonProps = {
  onClick: () => void;
  label?: string;
};

export default function DeleteButton({ onClick, label = 'Видалити' }: DeleteButtonProps) {
  const tUI = useTranslations('UI');
  return (
    <button
      className={styles.deleteButton}
      onClick={onClick}
      type="button"
    >
      {tUI(label)}
    </button>
  );
}

