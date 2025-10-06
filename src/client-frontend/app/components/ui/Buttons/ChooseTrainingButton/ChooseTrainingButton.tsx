"use client";

import Link from "next/link";
import ArrowIcon from "@/app/assets/icons/Arrow.svg";
import styles from "./ChooseTrainingButton.module.scss";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;      
           
};

const ChooseTrainingButton = ({ href, children}: Props) => {
  return ( 
  <Link href={href} className={styles.button}>
      
      <span className={styles.label}>{children}</span>
      <ArrowIcon className={styles.iconSvg} aria-hidden />
    </Link>
    );
}
export default ChooseTrainingButton;