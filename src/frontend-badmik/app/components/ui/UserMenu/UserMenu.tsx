'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './UserMenu.module.scss';

type UserMenuProps = {
  avatarUrl?: string;
  onLogout?: () => void;
};

export default function UserMenu({ avatarUrl, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        className="avatarButton"
        type="button"
      >
        <img
          src={avatarUrl || '/icons/userIcon.png'}
          alt="User avatar"
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <Link href="/profile">Мій профіль</Link>
          <Link href="/settings">Налаштування</Link>
          <hr />
          <button onClick={handleLogout} className="text-red-600">Вийти</button>
        </div>
      )}
    </div>
  );
}

