import Image from "next/image";
import styles from "./TrainingFormats.module.scss";
import data from "@/data/trainingFormats.json";

type TrainingFormat = {
  id: number;
  title: string;
  image: string;
};

export default function TrainingFormats() {
  const formats = data as TrainingFormat[];

  return (
    <section className="containerPage">
      <h2 className={styles.heading}>Формати тренувань</h2>
      <ul className={styles.grid}>
        {formats.map((format) => (
          <li key={format.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={format.image}
                alt={format.title}
                fill
                sizes="(min-width:1200px) 25vw, (min-width:768px) 50vw, 100vw"
                className={styles.image}
              />
            </div>
            <h3 className={styles.title}>{format.title}</h3>
          </li>
        ))}
      </ul>
    </section>
  );
}
