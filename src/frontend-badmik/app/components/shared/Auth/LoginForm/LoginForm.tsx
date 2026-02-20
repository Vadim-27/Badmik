'use client';

import { useRouter } from '@/i18n/navigation'
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import styles from './LoginForm.module.scss';

type LoginResponse =
  | { user: { role?: string; clubId?: string | null } }
  | { error?: string };

export default function LoginForm() {
  const t = useTranslations('Auth');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const isDisabled = useMemo(() => pending, [pending]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // читаємо тіло ОДИН раз
      const raw = await r.text();
      const data: LoginResponse = raw ? JSON.parse(raw) : {};

      if (!r.ok) {
        setError((data as any)?.error || t('error') || 'Login error');
        setPending(false);
        return;
      }

      const user = (data as any)?.user;

      setPending(false);

      if (user?.role === 'club_admin' && user?.clubId) {
        router.replace(`/admin/${user.clubId}`);
      } else {
        router.replace('/admin/dashboard');
      }

      router.refresh();
    } catch {
      setPending(false);
      setError(t('networkError') || 'Network error. Please try again.');
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('login')}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={[styles.input, error ? styles.errorInput : ''].join(' ')}
              disabled={isDisabled}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="password">
                {t('password')}
              </label>

              <button
                type="button"
                className={styles.showBtn}
                onClick={() => setShowPassword((v) => !v)}
                disabled={isDisabled}
              >
                {showPassword ? t('hide') : t('show')}
              </button>
            </div>

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={[styles.input, error ? styles.errorInput : ''].join(' ')}
              disabled={isDisabled}
            />
          </div>

          {error && <div className={styles.errorText}>{error}</div>}

          <button type="submit" className={styles.button} disabled={isDisabled}>
            {pending ? t('loggingIn') : t('login')}
          </button>
        </form>
      </div>
    </div>
  );
}
