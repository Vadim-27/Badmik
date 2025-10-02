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

export default function AppBreadcrumbs() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x); // ['clubs', '123', 'matches']

  return (
    <Breadcrumbs aria-label="breadcrumb" className={styles.breadcrumbs}>
      <Link href="/">{breadcrumbNameMap["/"]}</Link>

      {pathnames.map((value, index) => {
        const href = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;
        const label = breadcrumbNameMap[href] || value;

        return isLast ? (
          // Останній сегмент як текст (Simple breadcrumbs)
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
