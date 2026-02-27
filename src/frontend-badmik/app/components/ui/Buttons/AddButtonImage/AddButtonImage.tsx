'use client';

import React from 'react';

import css from './AddButtonImage.module.scss';
import { useTranslations } from 'next-intl';
import AddButton from '../AddButton/AddButton';

// type AddButtonImageProps = {

//   label: string;
// };

// const AddButtonImage: React.FC<AddButtonImageProps> = ({  label }) => {
//   const tUI = useTranslations('UI');
//   return (
//     <button className={css.addButton}>
//       {tUI(label)}
//     </button>
//   );
// };

// export default AddButtonImage;


export type DeleteButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

export default function AddButtonImage({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
    const tUI = useTranslations('UI');
  return (
    <button className={css.addButton} type="button" onClick={onClick} disabled={disabled}>
      {tUI(label)}
    </button>
  );
}