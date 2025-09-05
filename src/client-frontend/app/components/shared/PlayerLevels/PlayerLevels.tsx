import Image from "next/image";
import styles from "./PlayerLevels.module.scss";
import levels from "@/data/playerLevels.json";

type Level = {
  id: number;
  title: string;
  description: string;
  image: string; // /PlayerLevels/PL1.jpg …
};

export default function PlayerLevels() {
  const data = levels as Level[];

  return (
    <section className="containerPage">
      <h2 className={styles.heading}>Рівні гравців</h2>

      <ul className={styles.grid} role="list">
        {data.map((level) => (
          <li key={level.id} className={styles.card}>
            <div className={styles.thumb}>
              <Image
                src={level.image}
                alt={level.title}
                fill
                sizes="(min-width:1440px) 18vw, (min-width:1024px) 28vw, (min-width:768px) 45vw, 100vw"
                className={styles.img}
                priority={level.id <= 2}
              />
            </div>

            <h3 className={styles.title}>{level.title}</h3>
            <p className={styles.description}>{level.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
