'use client';

import React from 'react';
import {Link} from '@/i18n/navigation';
import css from './AddButton.module.scss';
import { useTranslations } from 'next-intl';

type AddButtonProps = {
  href: string;
  label: string;
};

const AddButton: React.FC<AddButtonProps> = ({ href, label }) => {
  const tUI = useTranslations('UI');
  return (
    <Link href={href} className={css.addButton}>
      {tUI(label)}
    </Link>
  );
};

export default AddButton;
