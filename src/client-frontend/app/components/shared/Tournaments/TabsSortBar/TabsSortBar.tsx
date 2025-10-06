"use client";

import styles from "./TabsSortBar.module.scss";
import ArrowChevron from "@/app/assets/icons/ArrowChevron.svg"; // або заміни шлях на свій

export default function TabsSortBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.tabs} role="tablist" aria-label="Фільтр турнірів">
        <button className={`${styles.tab} ${styles.active}`} role="tab" aria-selected="true">
          Поточні
          <span className={styles.underline} aria-hidden />
        </button>
        <button className={styles.tab} role="tab" aria-selected="false">
          Майбутні
        </button>
      </div>

      <div className={styles.sort}>
        <span className={styles.sortLabel}>Сортувати</span>
        <button className={styles.sortValue} type="button" aria-haspopup="listbox" aria-expanded="false">
          Популярні
          <ArrowChevron className={styles.chevron} aria-hidden />
        </button>
      </div>
    </div>
  );
}
