// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import styles from "./AppBreadcrumbs.module.scss";



// const breadcrumbNameMap: Record<string, string> = {
//   "/": "Головна",
//   "/clubs": "Клуби",
//   "/schedule": "Розклад",
//   "/tournaments": "Турніри",
//   "/contacts": "Контакти",
//   "/privacy": "Політика конфіденційності",
// };

// export default function AppBreadcrumbs() {
//   const pathname = usePathname();
//   const pathnames = pathname.split("/").filter((x) => x); // ['clubs', '123', 'matches']

//   return (
//     <Breadcrumbs aria-label="breadcrumb" className={styles.breadcrumbs}>
//       <Link href="/">{breadcrumbNameMap["/"]}</Link>

//       {pathnames.map((value, index) => {
//         const href = "/" + pathnames.slice(0, index + 1).join("/");
//         const isLast = index === pathnames.length - 1;
//         const label = breadcrumbNameMap[href] || value;

//         return isLast ? (
//           // Останній сегмент як текст (Simple breadcrumbs)
//           <p className={styles.breadcrumbs} key={href}>
//             {label}
//           </p>
//         ) : (
//           <Link href={href} key={href}>
//             {label}
//           </Link>
//         );
//       })}
//     </Breadcrumbs>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import styles from "./AppBreadcrumbs.module.scss";

const breadcrumbNameMap: Record<string, string> = {
  "/": "Головна",
  "/clubs": "Клуби",
  "/schedule": "Розклад",
  "/tournaments": "Турніри",
  "/contacts": "Контакти",
  "/privacy": "Політика конфіденційності",
};

type Props = {
  /** Ключ — повний шлях сегмента (наприклад "/clubs/<id>"), значення — підпис */
  overrides?: Record<string, string>;
  /** Кастомна логіка для підпису (поверни рядок щоб замінити, або null/undefined щоб залишити дефолт) */
  transformLabel?: (href: string, segment: string) => string | null | undefined;
};

export default function AppBreadcrumbs({ overrides = {}, transformLabel }: Props) {
  const pathname = usePathname();                           // напр. "/clubs/2672.../gallery"
  const pathnames = pathname.split("/").filter(Boolean);    // ["clubs","2672...","gallery"]

  return (
    <Breadcrumbs aria-label="breadcrumb" className={styles.breadcrumbs}>
      <Link href="/">{breadcrumbNameMap["/"]}</Link>

      {pathnames.map((segment, index) => {
        const href = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;

        // 1) спершу overrides від батька
        const label =
          overrides[href] ??
          // 2) потім глобальна карта статичних шляхів
          breadcrumbNameMap[href] ??
          // 3) потім опційний трансформер
          transformLabel?.(href, segment) ??
          // 4) дефолт — показати сам сегмент (розкодуємо у разі %20)
          decodeURIComponent(segment);

        return isLast ? (
          <p className={styles.breadcrumbs} key={href}>
            {label}
          </p>
        ) : (
          <Link href={href} key={href}>
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

