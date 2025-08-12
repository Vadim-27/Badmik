'use client';

import React from 'react';
import css from './SaveButton.module.scss';

type SaveButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, disabled, label = 'Зберегти' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={css.saveButton}
    >
      {label}
    </button>
  );
};

export default SaveButton;
