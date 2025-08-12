'use client';

import React from 'react';
import Link from 'next/link';
import css from './AddButton.module.scss';

type AddButtonProps = {
  href: string;
  label: string;
};

const AddButton: React.FC<AddButtonProps> = ({ href, label }) => {
  return (
    <Link href={href} className={css.addButton}>
      ➕ {label}
    </Link>
  );
};

export default AddButton;
