'use client';

import { useEffect, useState } from 'react';

type Props = {
  value?: string | null;
  locale?: string;            // за замовчуванням uk-UA
  options?: Intl.DateTimeFormatOptions;
  fallback?: string;          // за замовчуванням "—"
};

export default function SafeDate({
  value,
  locale = 'uk-UA',
  options = { year: 'numeric', month: '2-digit', day: '2-digit' },
  fallback = '—',
}: Props) {
  const [text, setText] = useState(fallback);

  useEffect(() => {
    if (!value) {
      setText(fallback);
      return;
    }

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      setText(String(value));
      return;
    }

    setText(d.toLocaleDateString(locale, options));
  }, [value, locale, fallback, options]);

  return <span suppressHydrationWarning>{text}</span>;
}
