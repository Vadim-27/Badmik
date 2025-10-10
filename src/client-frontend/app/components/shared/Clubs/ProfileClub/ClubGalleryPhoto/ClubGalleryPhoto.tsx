"use client";


import Slider from "./Slider";

import Image from "next/image";
import photoClub from "@/data/dataClubGalleryPhoto.json"; 

import styles from "./ClubGalleryPhoto.module.scss";

type PhotoClub = {
  id: number;
  image: string;
};

const ClubGalleryPhoto = () => {
  const data = photoClub as PhotoClub[];
//   const items = photoClub as PhotoClub[];
//   console.log(" data:", data);

  return (
    <section className="containerPage">
      <h2 className={styles.heading}>Фотогалерея</h2>

      {/* <Slider items={items} /> */}

      <Slider className={styles.slider}>
        {data.map((item) => (
          <div key={item.id} className={styles.slide}>
            <article className={styles.card}>
                <div className={styles.imageWrapper}>
              <Image
                src={item.image}
                alt='Photo Club'
                fill
                sizes="(min-width:1200px) 25vw, (min-width:768px) 50vw, 100vw"
                className={styles.image}
              />
                </div>
            
              
            </article>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default ClubGalleryPhoto;