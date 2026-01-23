'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './LanguageSwitcher.module.scss';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'uk', label: 'Українська' },
] as const;

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = pathname.split('/')[1] as (typeof LOCALES[number]['code'] | string);
  const current = useMemo(
    () => LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0],
    [currentLocale]
  );

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const changeLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/') || '/';
    router.push(newPath);
    setOpen(false);
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className={styles.root} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label}
        <span className={styles.chev} aria-hidden />
      </button>

      {open && (
        <div className={styles.menu} role="listbox" aria-label="Select language">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`${styles.item} ${l.code === current.code ? styles.active : ''}`}
              onClick={() => changeLocale(l.code)}
              role="option"
              aria-selected={l.code === current.code}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


