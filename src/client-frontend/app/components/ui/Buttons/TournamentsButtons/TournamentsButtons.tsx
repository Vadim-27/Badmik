"use client";


import ArrowIcon from "@/app/assets/icons/Arrow.svg";
import CheckVectorIcon from "@/app/assets/icons/CheckVector.svg";
import styles from "./TournamentsButtons.module.scss";
import clsx from "clsx";
import { ReactNode } from "react";

type Props = {
  status: string;
  children: ReactNode;      // текст кнопки
           // опційна SVG-іконка
};

export default function TournamentsButtons({ status, children}: Props) {
  return (
    <button  className={clsx(styles.button, {
        [styles.free]: status === "Free",
        [styles.joined]: status === "Joined",
        [styles.closed]: status === "Closed",
      })}>
      { status === "Joined" &&<CheckVectorIcon className={styles.iconSvg} aria-hidden />}
     <span className={styles.label}>{children}</span>
      { status === "Free" &&<ArrowIcon className={styles.iconSvg} aria-hidden />}
    </button>
  );
}