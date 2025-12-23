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

