
"use client"

import UserMenu from '@/app/components/ui/UserMenu/UserMenu';
import Cookies from 'js-cookie';
import jwt from 'jwt-simple';
import {Link} from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.scss';
import { LanguageSwitcher } from '@/app/components/shared/Header/LangSwitcher/LanguageSwitcher';

const JWT_SECRET = 'your-secret';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const router = useRouter();
  const token = Cookies.get('token');
 

  useEffect(() => {
    
    if (token) {
      try {
        const decoded = jwt.decode(token, JWT_SECRET);
        const role = decoded.role;
        setAvatarUrl(decoded.avatarUrl); 
        setIsAuthenticated(true);
       
        setIsAdmin(['owner_admin', 'assistant', 'club_admin'].includes(role));
        router.refresh();
      } catch (err) {
        Cookies.remove('token');
        setIsAuthenticated(false);
      }
    }
  }, [token, router]);

  const handleLogout = () => {
    Cookies.remove('token');
    // window.location.reload();
    setIsAuthenticated(false); 
  router.refresh(); 
  router.push('/');
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/">Logo</Link>
        {/* {isAdmin && <Link href="/admin">Admin</Link>} */}
      </nav>

      <div className={styles.actions}>
        <LanguageSwitcher />
        {isAuthenticated ? (
          <UserMenu avatarUrl={avatarUrl} onLogout={handleLogout} />
        ) : (
          <Link href="/login" className={styles.authButton}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

