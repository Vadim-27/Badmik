// app/components/Footer/Footer.tsx
import Link from "next/link";
import styles from "./Footer.module.scss";

// SVG-іконки як React-компоненти

import InstagramIcon from "@/app/assets/icons/Instagram.svg";
import FacebookIcon from "@/app/assets/icons/facebook.svg";
import XIcon from "@/app/assets/icons/icons_x.svg";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} containerPage`}>
        {/* Лого + копірайт */}
        <div className={styles.brand}>
          <Link href="/" aria-label="На головну" className={styles.logoWrap}>
            LOGO
          </Link>
          <p className={styles.copy}>© 2025 Logo</p>
        </div>

        {/* Навігація */}
        <nav className={styles.nav} aria-label="Футер навігація">
          <Link href="/clubs">Клуби</Link>
          <Link href="/schedule">Розклад</Link>
          <Link href="/tournaments">Турніри</Link>
          <Link href="/contacts">Контакти</Link>
          <Link href="/privacy">Політика конфіденційності</Link>
        </nav>

        {/* Соцмережі */}
        <div className={styles.social}>
          <p className={styles.socialTitle}>
            Приєднуйтесь до нас у соціальних мережах
          </p>
          <div className={styles.icons}>
            <Link
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={styles.iconBtn}
            >
              <InstagramIcon className={styles.icon} aria-hidden />
            </Link>
            <Link
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className={styles.iconBtn}
            >
              <FacebookIcon className={styles.icon} aria-hidden />
            </Link>
            <Link
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className={styles.iconBtn}
            >
              <XIcon className={styles.icon} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
