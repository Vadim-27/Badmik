"use client";

import Image from "next/image";
import Slider from "./Slider";
import data from "@/data/scheduleTraining.json";
import MapIcon from "@/app/assets/icons/Map.svg";
import TimerIcon from "@/app/assets/icons/Timer.svg";
import HeartIcon from "@/app/assets/icons/heart.svg";
import styles from "./ScheduleTraining.module.scss";

type Training = {
  id: number;
  date: string;
  title: string;
  address: string;
  description: string;
  time: string;
  level: string;
  image: string;
};

export default function ScheduleTraining() {
  const trainings = data as Training[];

  const renderCard = (item: Training) => {
    const [day, month] = item.date.split(" "); // "22" | "Серп"

    return (
      <article key={item.id} className={styles.card}>
        <div className={styles.thumb}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            className={styles.img}
            sizes="(min-width:1200px) 25vw, (min-width:768px) 40vw, 100vw"
          />
          <div className={styles.overlay} aria-hidden />
          <div className={styles.topRow}>
            <div className={styles.topBox}>
              <span className={styles.day}>{day}</span>
              <span className={styles.month}>{month}</span>
            </div>
            <div className={styles.topBox}>
              <HeartIcon className={styles.heartIcon} aria-hidden />
            </div>
          </div>
          <div className={styles.topContent}>
            <h3 className={styles.title}>{item.title}</h3>
            <div className={styles.addressWrapper}>
              <MapIcon className={styles.MapIcon} aria-hidden />
              <p className={styles.address}>{item.address}</p>
            </div>
          </div>
        </div>

        <div className={styles.bottomBox}>
          <p className={styles.desc}>{item.description}</p>
          <div className={styles.meta}>
            <TimerIcon className={styles.timerIcon} aria-hidden />
            <span className={styles.bottomBoxTime}>{item.time}</span>
            <span className={styles.bottomBoxLevel}>{item.level}</span>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="containerPage">
      <h2 className={styles.heading}>Попередній розклад занять</h2>

      {trainings.length > 4 ? (
        <Slider className={styles.slider}>
          {trainings.map((item) => (
            <div key={item.id} className={styles.slide}>
              {renderCard(item)}
            </div>
          ))}
        </Slider>
      ) : (
        <div className={styles.list}>
          {trainings.map((item) => renderCard(item))}
        </div>
      )}
    </section>
  );
}