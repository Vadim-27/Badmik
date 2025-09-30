"use client";

import { useState } from "react";
import styles from "./OurClubsList.module.scss";
import ClubCard from "./ClubCard/ClubCard";
// імпорт JSON (потрібно: "resolveJsonModule": true у tsconfig)
import data from "@/data/ourListClubs.json";

export type Club = typeof data.clubs[number];

export default function OurClubsList() {
  const clubs = data.clubs;
  const [visible, setVisible] = useState(6);

  const showMore = () => {
    setVisible((v) => Math.min(v + 3, clubs.length));
  };

  const canShowMore = visible < clubs.length;

  return (
    <section className="containerPage">
      <h2 className={styles.title}>Наші клуби</h2>

      <div className={styles.grid}>
        {clubs.slice(0, visible).map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>

      {canShowMore && (
        <div className={styles.moreWrap}>
          <button className={styles.moreBtn} onClick={showMore}>
            Показати більше
            <span className={styles.plus}>+</span>
          </button>
        </div>
      )}
    </section>
  );
}
