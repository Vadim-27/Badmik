'use client';

import React from 'react';
import clsx from 'clsx';


type ActionHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

const ActionHeader: React.FC<ActionHeaderProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'bg-white mb-8 p-4 border-b flex flex-wrap items-center justify-between gap-2 rounded-2xl shadow border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ActionHeader;
