"use client";

import Link from "next/link";
import ArrowIcon from "@/app/assets/icons/Arrow.svg";
import styles from "./ClubListButton.module.scss";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;      // текст кнопки
           // опційна SVG-іконка
};

export default function ClubListButton({ href, children}: Props) {
  return (
    <Link href={href} className={styles.button}>
      
      <span className={styles.label}>{children}</span>
      <ArrowIcon className={styles.iconSvg} aria-hidden />
    </Link>
  );
}