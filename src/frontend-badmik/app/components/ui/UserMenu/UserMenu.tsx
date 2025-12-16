'use client';

import { useState, useRef, useEffect } from 'react';
import {Link} from '@/i18n/navigation';
import styles from './UserMenu.module.scss';
import { useTranslations } from 'next-intl';

type UserMenuProps = {
  avatarUrl?: string;
  onLogout?: () => void;
};

export default function UserMenu({ avatarUrl, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = useTranslations('UserMenu');

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.userMenu} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles.avatarButton}
        type="button"
      >
        <img
          src={avatarUrl || '/icons/userIcon.png'}
          alt="User avatar"
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <Link href="/profile">{t('profile')}</Link>
          <Link href="/settings">{t('settings')}</Link>
          <hr />
          <button onClick={handleLogout} className="text-red-600">
            {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
}

