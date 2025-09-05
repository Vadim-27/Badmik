// Server Component (Next 15, App Router)
import Image from "next/image";
import MapIcon from "@/app/assets/icons/Map.svg";
import ClubListButton from "@/app/components/ui/Buttons/ClubListButton/ClubListButton";
import styles from "./ClubsList.module.scss";

type Club = {
  id: number;
  title: string;
  address: string;
  description: string;
  price: string;
  image: string; // опційно: /images/clubs/1.jpg тощо
};

// імітація запиту (штучна затримка)
async function getClubs(): Promise<Club[]> {
  // невелика затримка, щоб було схоже на «fetch»
  await new Promise((r) => setTimeout(r, 300));
  // імпорт локального JSON
  const data = (await import("@/data/clubList.json")).default as Club[];
  return data;
}

export default async function ClubsList() {
  const clubs = await getClubs();

  return (
    <>
      <section className="containerPage">
        <h2 className={styles.titleSection}>Про клуби</h2>
        <ul className={styles.grid}>
          {clubs.map((club) => {
            // const src = `${club.image}.jpg`; // якщо кладеш у /public/clubs/clubN.jpg
            return (
              <li key={club.id} className={styles.cardItem}>
                <article className={styles.card}>
                  <div className={styles.media}>
                    <Image
                      src={club.image}
                      alt={club.title}
                      fill
                      sizes="(min-width:1200px) 33vw, (min-width:768px) 50vw, 100vw"
                      className={styles.mediaImg}
                      priority={club.id <= 3} // опц.: перші — пріоритетні
                    />
                    <div className={styles.overlay} aria-hidden />
                    <div className={styles.topContent}>
                      <h3 className={styles.title}>{club.title}</h3>
                      <div className={styles.addressWrapper}>
                        <MapIcon className={styles.MapIcon} aria-hidden />
                        <p className={styles.address}>{club.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.bottom}>
                    <p className={styles.description}>{club.description}</p>
                    <div className={styles.bottomRow}>
                      <p className={styles.price}>
                        <span>від </span>
                        <span className={styles.priceValue}>{club.price}</span>
                      </p>
                      <ClubListButton href={`/clubs/${club.id}`}>
                        Детальніше
                      </ClubListButton>
                    </div>
                  </div>
                  {/* кнопку "Детальніше" додаси тут окремим компонентом */}
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
