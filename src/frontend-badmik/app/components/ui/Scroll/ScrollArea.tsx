// components/ui/ScrollArea.tsx
'use client';
import React from 'react';
import s from './ScrollArea.module.scss';

type Props = React.PropsWithChildren<{
  className?: string;
  style?: React.CSSProperties;
}>;

export default function ScrollArea({ className, style, children }: Props) {
  return (
    <div className={`${s.scrollArea} ${className ?? ''}`} style={style}>
      {children}
    </div>
  );
}

