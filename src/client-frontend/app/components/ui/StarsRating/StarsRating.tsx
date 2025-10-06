"use client";

import styles from "./StarsRating.module.scss";
import StarIcon from "@/app/assets/icons/StarVector.svg"; // твоя SVG-іконка зірки

type Props = {
  rating: number;
};

export default function StarRating({ rating }: Props) {
  return (
    <div className={styles.starWrapper}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`${styles.star} ${i < rating ? styles.filled : styles.empty}`}
          aria-hidden
        />
      ))}
    </div>
  );
}
