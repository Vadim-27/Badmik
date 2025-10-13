// app/components/shared/Header/HeaderClient.tsx  ← CLIENT
"use client";

import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import UserMenu from "@/app/components/ui/UserMenu/UserMenu";
import styles from "./Header.module.scss";
import { LanguageSwitcher } from "@/app/components/shared/Header/HeaderClient/LangSwitcher/LanguageSwitcher";

type Props = {
  isAuthenticated: boolean;
  role?: string;
  userId?: string;
  email?: string;
  avatarUrl?: string;
};

export default function HeaderClient({
  isAuthenticated,
  role,
  userId,
  email,
  avatarUrl,
}: Props) {
  const router = useRouter();

  const handleLogout = async () => {
   
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/">Logo</Link>
       
        {isAuthenticated && role === "Admin" && <Link href="/admin">Admin</Link>}
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
