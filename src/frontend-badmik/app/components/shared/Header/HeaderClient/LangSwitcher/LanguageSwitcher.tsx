'use client';

import { useRouter, usePathname } from 'next/navigation';

const locales = [
  { code: 'en', label: 'English' },
  { code: 'uk', label: 'Український' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // Визначаємо поточну локаль з URL, наприклад /en/admin/club-1 => en
  const currentLocale = pathname.split('/')[1];

  const changeLocale = (newLocale: string) => {
    // Замінюємо перший сегмент URL на нову локаль
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/') || '/';

    router.push(newPath);
  };

  return (
    <select
      value={currentLocale}
      onChange={(e) => changeLocale(e.target.value)}
      aria-label="Select language"
      style={{ padding: '0.25rem', fontSize: '1rem' }}
    >
      {locales.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}

