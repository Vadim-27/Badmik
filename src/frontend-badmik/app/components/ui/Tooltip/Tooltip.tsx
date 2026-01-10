'use client';

import React from 'react';
import styles from './Tooltip.module.scss';

type Props = {
  content: React.ReactNode;      
  children: React.ReactNode;     
  className?: string;            
  tooltipClassName?: string;     
};

export default function Tooltip({ content, children, className, tooltipClassName }: Props) {
  // якщо нічого не передали — просто повертаємо дітей без обгортки
  if (content === null || content === undefined || content === '' || content === false) {
    return <>{children}</>;
  }

  return (
    <span className={`${styles.wrap} ${className ?? ''}`}>
      {children}
      <span className={`${styles.tooltip} ${tooltipClassName ?? ''}`}>{content}</span>
    </span>
  );
}
