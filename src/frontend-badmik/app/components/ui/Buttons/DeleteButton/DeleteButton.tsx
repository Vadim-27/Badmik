'use client';

import styles from './DeleteButton.module.scss';

type DeleteButtonProps = {
  onClick: () => void;
  label?: string;
};

export default function DeleteButton({ onClick, label = 'Видалити' }: DeleteButtonProps) {
  return (
    <button
      className={styles.deleteButton}
      onClick={onClick}
      type="button"
    >
      🗑️ {label}
    </button>
  );
}

