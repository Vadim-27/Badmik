// import Image from "next/image";
// import Header from "../../Header/Header";
// import FiltersBarSection from "../../FiltersBar/HomePageFiltersBar/FiltersBarSection";
// import ChooseTrainingButton from "@/app/components/ui/Buttons/ChooseTrainingButton/ChooseTrainingButton";
// import styles from "./HeroHomePage.module.scss";

// const HeroHomePage = () => {
//   return (
//     <section className={styles.hero}>
//         <Header />
//         <div className={styles.containerHero}>
            

//             <div className={styles.contentHero}>
//                 <h1 className={styles.titleHero}>Бадмінтон — твій шлях до сили, швидкості та драйву!</h1>
//                 <p className={styles.textHero}>Заняття для дітей, підлітків та дорослих. Індивідуальні плани, дружня атмосфера та регулярні турніри. Почни грати вже сьогодні!</p>
//                 <ChooseTrainingButton href="/schedule-training">Обрати тренування</ChooseTrainingButton>
//             </div>
//             <div className={styles.imageWrapper}>
//                 <Image 
//                     src="/hero/woman-holding-racket-front-view 1.jpg"
//                     alt="Гравець у бадмінтон"
//                     fill
//                     // sizes="(min-width:1440px) 40vw, (min-width:1024px) 50vw, (min-width:768px) 70vw, 100vw"
//                     className={styles.image}    
//                     priority
//                 />
//             </div>
           
//         </div>
//          <FiltersBarSection />
//     </section>
//   );
// }
// export default HeroHomePage;

import Image from "next/image";
import Header from "../../Header/Header";
import FiltersBarSection from "../../FiltersBar/HomePageFiltersBar/FiltersBarSection";
import ChooseTrainingButton from "@/app/components/ui/Buttons/ChooseTrainingButton/ChooseTrainingButton";
import styles from "./HeroHomePage.module.scss";

const HeroHomePage = () => {
  return (
    <section className={styles.hero}>
      <Header />

      <div className={styles.containerHero}>
        <div className={styles.contentHero}>
          <h1 className={styles.titleHero}>
            Бадмінтон — твій шлях до сили, швидкості та драйву!
          </h1>
          <p className={styles.textHero}>
            Заняття для дітей, підлітків та дорослих. Індивідуальні плани, дружня
            атмосфера та регулярні турніри. Почни грати вже сьогодні!
          </p>
          <ChooseTrainingButton href="/schedule-training">
            Обрати тренування
          </ChooseTrainingButton>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src="/hero/woman-holding-racket-front-view 1.jpg"
            alt="Гравець у бадмінтон"
            fill
            sizes="(min-width:1440px) 40vw, (min-width:1024px) 45vw, (min-width:768px) 55vw, 92vw"
            className={styles.image}
            priority
          />
        </div>
      </div>

      <FiltersBarSection />
    </section>
  );
};

export default HeroHomePage;
