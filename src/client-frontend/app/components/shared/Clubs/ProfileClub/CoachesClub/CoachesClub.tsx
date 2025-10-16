"use client";


import Slider from "./Slider";

import Image from "next/image";
import coaches from "@/data/coaches.json"; 
import FrameDot from "@/app/assets/icons/FrameDot.svg";
import styles from "./CoachesClub.module.scss";

type Coaches = {
  id: number;
  name: string;
  specialization: string;
  image: string;
};

const CoachesClub = () => {
  const data = coaches as Coaches[];
  console.log(" data:", data);

  return (
    <section className="containerPage">
      <h2 className={styles.heading}>Тренери клубу</h2>

      <Slider className={styles.slider}>
        {data.map((item) => (
          <div key={item.id} className={styles.slide}>
            <article className={styles.card}>
                <div className={styles.imageWrapper}>
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width:1200px) 25vw, (min-width:768px) 50vw, 100vw"
                className={styles.image}
              />
                </div>
              <h4 className={styles.author}>{item.name}</h4>
              <div className={styles.specialization}>
                <FrameDot className={styles.frameDot} aria-hidden />
              <p className={styles.text}>{item.specialization}</p>
              </div>
              
            </article>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default CoachesClub;