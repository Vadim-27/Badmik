'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';

import styles from './ProfileMenu.module.scss';
import { buildHrefServer } from '@/lib/club-scope.server';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

type Props = {
  avatarUrl?: string;
  fullName: string;
  position: string;
  userId?: string;
  onLogout: () => void;
  staffId: string;
};

export default function ProfileMenu({ avatarUrl, fullName, position, userId, onLogout, staffId }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const t  = useTranslations('Header');
  const tType = useTranslations('EmploymentType');

  const { clubId } = useParams<{ clubId: string }>();

  const fallbackAvatar =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" rx="16" fill="#e2e8f0"/><circle cx="32" cy="26" r="12" fill="#94a3b8"/><rect x="14" y="42" width="36" height="16" rx="8" fill="#94a3b8"/></svg>`
    );

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const staffHref = buildHrefServer(clubId, `staff/${staffId}`);

  return (
    <div className={styles.root} ref={ref}>
      <button type="button" className={styles.trigger} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <img className={styles.avatar} src={avatarUrl || fallbackAvatar} alt="" />
        <span className={styles.text}>
          <span className={styles.name}>{fullName}</span>
          <span className={styles.role}>{tType(position)}</span>
        </span>
        <span className={styles.chev} aria-hidden />
      </button>

      {open && (
        <div className={styles.menu}>
          <Link className={styles.item} href={staffHref}>
           {t('profile')}
          </Link>

          <button
            type="button"
            className={styles.itemBtn}
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
}
