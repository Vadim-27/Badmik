"use client";

import clsx from "clsx";
import Image from "next/image";

import styles from "./ClubCard.module.scss";
import type { Club } from "@/types/ourClubsList";
import MapIcon from "@/app/assets/icons/Map.svg";
import FootballField from "@/app/assets/icons/FootballField.svg";
import Parking from "@/app/assets/icons/Parking.svg";
import WaterDrop from "@/app/assets/icons/WaterDrop.svg";
import AirConditioner from "@/app/assets/icons/AirConditioner.svg";
import Columns from "@/app/assets/icons/Columns.svg";
import ClubListButton from "@/app/components/ui/Buttons/ClubListButton/ClubListButton";

export default function ClubCard({ club }: { club: Club }) {
  const {
    name,
    badge,
    image,
    description,
    address,
    features,
    priceFrom,
    currency,
    detailsUrl,
  } = club;

  const badgeClass =
    badge === "Топ"
      ? styles.top
      : badge === "Новий"
      ? styles.new
      : badge === "Рекомендовано"
      ? styles.recommended
      : "";

  return (
    <article className={styles.card}>
      <div className={styles.mediaWrap}>
        {badge && (
          <span className={clsx(styles.badge, badgeClass)}>{badge}</span>
        )}

        <Image
          className={styles.media}
          src={image}
          alt={name}
          width={640}
          height={360}
          priority={false}
        />
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.desc}>{description}</p>

        <div className={styles.row}>
          <MapIcon className={styles.MapIcon} aria-hidden />
          <span className={styles.meta}>{address}</span>
        </div>

        <div className={styles.tags}>
          <span className={styles.tag}>
            <FootballField className={styles.icon} aria-hidden />
            <span className={styles.tagText}>{features.courts} корти</span>
          </span>
          <span className={styles.tag}>
            <Columns className={styles.icon} aria-hidden />
            <span className={styles.tagText}>{features.flooring}</span>
          </span>
          {features.parking && (
            <span className={styles.tag}>
              <Parking className={styles.icon} aria-hidden />
              <span className={styles.tagText}>Парковка</span>
            </span>
          )}
          {features.water && (
            <span className={styles.tag}>
              <WaterDrop className={styles.icon} aria-hidden />
              <span className={styles.tagText}>Вода</span>
            </span>
          )}
          {features.airConditioning && (
            <span className={styles.tag}>
              <AirConditioner className={styles.icon} aria-hidden />
              <span className={styles.tagText}>Кондиціонер</span>
            </span>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.priceWrap}>
            <span className={styles.priceLabel}>від</span>
            <span className={styles.priceValue}>
              {priceFrom} {currency === "UAH" ? "₴" : currency}
            </span>
          </div>

          <ClubListButton href={detailsUrl} size="medium" className="cardBtn">
            Детальніше
          </ClubListButton>
        </div>
      </div>
    </article>
  );
}
