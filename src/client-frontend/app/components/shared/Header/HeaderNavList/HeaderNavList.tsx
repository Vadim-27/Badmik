import React from "react";
import Link from "next/link";
import styles from "./HeaderNavList.module.scss";
import { navLinks } from "./navLinks";

const HeaderNavList = () => {
  return (
    <nav aria-label="Головна навігація">
      <ul className={styles.navList}>
        {navLinks.map((link) => (
          <li key={link.path} className={styles.navItem}>
            <Link href={link.path} className={styles.navLink}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HeaderNavList;