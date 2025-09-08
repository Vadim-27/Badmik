"use client";

import Image from "next/image";
import Slider from "@/app/components/shared/Tournaments/Slider";
import ClubListButton from "@/app/components/ui/Buttons/ClubListButton/ClubListButton"; 
import tournaments from "@/data/tournaments.json";
import MapIcon from "@/app/assets/icons/Map.svg";
import TimerIcon from "@/app/assets/icons/Timer.svg";
import HeartIcon from "@/app/assets/icons/heart.svg";
import WalletIcon from "@/app/assets/icons/Wallet.svg";
import styles from "./Tournaments.module.scss";

type Tournament = {
  id: number;
  title: string;
  date: string;
  time: string;
  level: string;
  club: string;
  address: string;
  price: number;
  status: "Вільні місця" | "Приєднався" | "Закінчився";
  participantsJoined: number;
  participantsLimit: number;
  image: string;
};

export default function Tournaments() {
  const items = tournaments as Tournament[];

  const renderCard = (item: Tournament) => (
    <article key={item.id} className={styles.card}>
      <div className={styles.thumb}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          className={styles.img}
          sizes="(min-width:1440px) 25vw, (min-width:768px) 40vw, 100vw"
        />
        <div className={styles.overlay} aria-hidden />
        {/* <div className={styles.topRow}> */}
          <button type="button" className={styles.favBtn} aria-label="В обране">
            <HeartIcon className={styles.heartIcon} aria-hidden />
          </button>
        {/* </div> */}

        
      </div>

      {/* <div className={styles.topContent}>
          <h3 className={styles.title}>{item.title}</h3>
        </div> */}

      <div className={styles.content}>
        <div>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.date}>{item.date}</p>
        </div>

        <div className={styles.metaLine}>
          <TimerIcon className={styles.iconTimer} aria-hidden />
          <span className={styles.time}>{item.time}</span>
         
          <span className={styles.level}>{item.level}</span>
        </div>

        <div className={styles.metaLine}>
          <MapIcon className={styles.icon} aria-hidden />
          <div>
          <p className={styles.club}>{item.club}</p>
          <p className={styles.address}>{item.address}</p>
          </div>
        </div>

        <div className={styles.metaLine}>
            <WalletIcon className={styles.icon} aria-hidden />
          <span className={styles.price}>{item.price} грн</span>
        </div>

        <div className={styles.bottomRow}>
            <ClubListButton href={`/clubs/${item.id}`}>
                                    Детальніше
                                  </ClubListButton>
          {/* <button
            type="button"
            className={`${styles.cta} ${
              item.status === "Закінчився"
                ? styles.ctaDisabled
                : item.status === "Приєднався"
                ? styles.ctaSuccess
                : ""
            }`}
            disabled={item.status === "Закінчився"}
          >
            {item.status === "Вільні місця"
              ? "Приєднатися"
              : item.status === "Приєднався"
              ? "Приєднався"
              : "Закінчився"}
          </button> */}

          <div className={styles.participants}>
            <span className={styles.participantsLabel}>Учасники приєдналися</span>
            <span className={styles.participantsCount}>
              {item.participantsJoined}/{item.participantsLimit}
            </span>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <section className="containerPage">
      <h2 className={styles.heading}>Турніри</h2>

      {items.length > 4 ? (
        <Slider className={styles.slider}>
          {items.map((item) => (
            <div key={item.id} className={styles.slide}>
              {renderCard(item)}
            </div>
          ))}
        </Slider>
      ) : (
        <div className={styles.list}>
          {items.map((item) => renderCard(item))}
        </div>
      )}
    </section>
  );
}
