"use client";


import Slider from "./Slider";
import StarRating from "../../ui/StarsRating/StarsRating";

import reviews from "@/data/reviews.json"; // твій JSON із відгуками
import styles from "./Reviews.module.scss";

type Review = {
  id: number;
  author: string;
  comment: string;
  rating: number;
};

const Reviews = () => {
  const data = reviews as Review[];
  console.log(" data:", data);

  return (
    <section className="containerPage">
      <h2 className={styles.heading}>Відгуки наших гравців</h2>

      <Slider className={styles.slider}>
        {data.map((item) => (
          <div key={item.id} className={styles.slide}>
            <article className={styles.card}>
              <StarRating rating={item.rating} />
              <p className={styles.text}>«{item.comment}»</p>
              <h4 className={styles.author}>{item.author}</h4>
            </article>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Reviews;
