'use client';

import { usePathname } from 'next/navigation';

// UUIDv4 детектор — щоб не тримати список “глобальних” сегментів
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type BuildHrefOptions = {
  /** чи вважати шлях “клубним”. якщо false — ігноруємо clubId навіть якщо він є */
  scoped?: boolean;
};

/**
 * Витягує clubId з URL (якщо перший сегмент після /admin — UUID),
 * і дає buildHref(), який будує коректні шляхи у глобальному/клубному контексті.
 */
export function useClubScope() {
  const pathname = usePathname(); 

  // Зрізаємо локаль (uk, en, uk-UA тощо)
  const noLocale = pathname.replace(/^\/[a-z]{2}(?:-[A-Za-z]{2})?\//, '/'); 

  // Беремо перший сегмент після /admin
  const match = noLocale.match(/^\/admin\/([^/]+)/);
  const firstSegment = match?.[1];

  const clubId = firstSegment && UUID_RE.test(firstSegment) ? firstSegment : undefined;

  function buildHref(path: string, opts: BuildHrefOptions = { scoped: true }) {
    const clean = path.startsWith('/') ? path.slice(1) : path; // 'players'
    const base = '/admin';
    if (opts.scoped !== false && clubId) {
      return `${base}/${clubId}/${clean}`.replace(/\/+$/, '/'); // нормалізація кінцевого слеша
    }
    return `${base}/${clean}`.replace(/\/+$/, '/');
  }

  return { clubId, buildHref };
}

//=======

