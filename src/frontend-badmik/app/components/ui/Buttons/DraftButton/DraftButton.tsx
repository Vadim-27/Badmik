'use client';

import React from 'react';
import {Link} from '@/i18n/navigation';
import css from './DraftButton.module.scss';
import { useTranslations } from 'next-intl';

type DraftButtonProps = {
    onClick: () => void;
  disabled?: boolean;
  label?: string;
};

const DraftButton: React.FC<DraftButtonProps> = ({ onClick, disabled, label = 'Зберегти'}) => {
  const tUI = useTranslations('UI');
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={css.draftButton}
    >
      {tUI(label)}
    </button>
  );
};

export default DraftButton;
