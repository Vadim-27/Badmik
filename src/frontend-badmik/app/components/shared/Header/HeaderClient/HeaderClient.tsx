// // app/components/shared/Header/HeaderClient.tsx  ← CLIENT
// "use client";

// import { useRouter } from "next/navigation";
// import { Link } from "@/i18n/navigation";
// import UserMenu from "@/app/components/ui/UserMenu/UserMenu";
// import styles from "./Header.module.scss";
// import { LanguageSwitcher } from "@/app/components/shared/Header/HeaderClient/LangSwitcher/LanguageSwitcher";

// type Props = {
//   isAuthenticated: boolean;
//   role?: string;
//   userId?: string;
//   email?: string;
//   avatarUrl?: string;
// };

// export default function HeaderClient({
//   isAuthenticated,
//   role,
//   userId,
//   email,
//   avatarUrl,
// }: Props) {
//   const router = useRouter();

//   const handleLogout = async () => {
   
//     await fetch("/api/auth/logout", { method: "POST" });
//     router.replace("/login");
//     router.refresh();
//   };

//   return (
//     <header className={styles.header}>
//       <nav className={styles.nav}>
//         <Link href="/">Logo</Link>
       
//         {isAuthenticated && role === "Admin" && <Link href="/admin">Admin</Link>}
//       </nav>

//       <div className={styles.actions}>
//         <LanguageSwitcher />
//         {isAuthenticated ? (
//           <UserMenu avatarUrl={avatarUrl} onLogout={handleLogout} />
//         ) : ( ""
//           // <Link href="/login" className={styles.authButton}>
//           //   Login
//           // </Link>
//         )}
//       </div>
//     </header>
//   );
// }


// app/components/shared/Header/HeaderClient/HeaderClient.tsx
'use client';

import { Link, useRouter } from '@/i18n/navigation';

import styles from './Header.module.scss';
import { LanguageSwitcher } from './LangSwitcher/LanguageSwitcher';
import ProfileMenu from './ProfileMenu/ProfileMenu';

// приклад як ви імпортуєте svg-іконки
import BadmikIcon from '@/app/assets/icons/Logo.svg'; // <- підстав свій реальний файл
import { useStaffByUserId } from '@/services/staff/queries.client';

type Props = {
  isAuthenticated: boolean;
  role?: string;
  userId?: string;
  email?: string;
  avatarUrl?: string;
  staffId?: string;
};

export default function HeaderClient({ isAuthenticated, role, userId, email, avatarUrl }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login'); // locale збережеться, бо router з '@/i18n/navigation'
    router.refresh();
  };

  const staffQ = useStaffByUserId(userId ?? '', { enabled: !!userId });

  const firstName = staffQ.data?.firstName?.trim();
  const lastName = staffQ.data?.lastName?.trim();

  const fullName =
    firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : 'Імʼя не знайдено';

  const position =
    staffQ.data?.employmentType ?? staffQ.data?.title ?? 'Посада не знайдено';

  const staffId = staffQ.data?.id;

  const resolvedAvatar = staffQ.data?.imageUrl ?? avatarUrl;

  return (
    <header className={`${styles.bgSlate700} ${styles.header} ${styles.rounded2xl} ${styles.shadowLg}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIconWrap} aria-hidden>
            <BadmikIcon className={styles.logoIcon} />
          </span>
          <span className={styles.logoText}>Badmik</span>
        </Link>

        <div className={styles.actions}>
          <LanguageSwitcher />

          {isAuthenticated ? (
            <ProfileMenu
              // avatarUrl={resolvedAvatar}
              staffId={staffId ?? ''}
              fullName={fullName}
              position={String(position)}
              userId={userId}
              onLogout={handleLogout}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}