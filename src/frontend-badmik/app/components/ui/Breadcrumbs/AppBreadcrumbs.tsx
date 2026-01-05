


import Link from 'next/link';
import styles from './AppBreadcrumbs.module.scss';

type Crumb = { label: string; href?: string };

export default function AppBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb" className={styles.root}>
      <ol className={styles.list}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className={styles.item}>
              {item.href && !isLast ? (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.current}>{item.label}</span>
              )}
              {!isLast && <span className={styles.sep}>›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

