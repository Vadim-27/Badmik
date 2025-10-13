"use client";

import clsx from "clsx";
import Link from "next/link";
import ArrowIcon from "@/app/assets/icons/Arrow.svg";
import styles from "./ClubListButton.module.scss";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  size?: string;
  className?: string;      // текст кнопки
           // опційна SVG-іконка
};

export default function ClubListButton({ href, size, children, className}: Props) {

 
  const sizeClass =
    size === "small" 
      ? styles.small
      : size === "medium"
      ? styles.medium
      : size === "large"
      ? styles.large
      : "";
  return (
    <Link href={href} className={clsx ( styles.button, sizeClass, className)} >
      
      <span className={styles.label}>{children}</span>
      <ArrowIcon className={styles.iconSvg} aria-hidden />
    </Link>
  );
}