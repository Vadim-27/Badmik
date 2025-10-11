"use client";


import Slider from "./Slider";

// import Image from "next/image";
import dataDayWeek from "@/data/dataDayWeek.json"; 
// import FrameDot from "@/app/assets/icons/FrameDot.svg";
import styles from "./TimeSlider.module.scss";

type DayWeek = {
  id: number;
  day: string;
  date: string;
 
};

const TimeSlider = () => {
  const data = dataDayWeek as DayWeek[];
  console.log(" data:", data);

  return (
    <section >
  

      <Slider className={styles.slider}>
        {data.map((item) => (
          <div key={item.id} className={styles.slide}>
            <article className={styles.card}>
            
              <p className={styles.time}>{item.day}</p>
        
              <p className={styles.time}>{item.date}</p>
            
              
            </article>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default TimeSlider;