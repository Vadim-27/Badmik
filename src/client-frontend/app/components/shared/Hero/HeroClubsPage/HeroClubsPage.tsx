"use client";


import Header from "../../Header/Header";
import FiltersBarSection from "../../FiltersBar/ClubsPageFiltersBar/FiltersBarSection";
import AppBreadcrumbs from "@/app/components/ui/AppBreadcrumbs/AppBreadcrumbs";

import styles from "./HeroClubsPage.module.scss";

const HeroClubsPage = () => {
  return (
    <section className={styles.hero}>
        <Header />
        <div className={styles.breadcrumbsWrapper}>
            <AppBreadcrumbs/>
        </div>
        
        <div className={styles.containerHero}>
            
           
            <div className={styles.contentHero}>
                <h1 className={styles.titleHero}>Обери свій клуб</h1>
                <p className={styles.textHero}>Під час вибору рекомендується враховувати розташування клубу, рівень кваліфікації тренерського складу, спектр запропонованих програм та стан інфраструктури. Оптимальний спортивний клуб забезпечує комфортні умови для занять, безпеку та сприяє досягненню особистих цілей у сфері спорту й фітнесу.</p>
                {/* <ChooseTrainingButton href="/schedule-training">Обрати тренування</ChooseTrainingButton> */}
            </div>
            {/* <div className={styles.imageWrapper}>
                <Image 
                    src="/hero/woman-holding-racket-front-view 1.jpg"
                    alt="Гравець у бадмінтон"
                    fill
                    // sizes="(min-width:1440px) 40vw, (min-width:1024px) 50vw, (min-width:768px) 70vw, 100vw"
                    className={styles.image}    
                    priority
                />
            </div> */}
           
        </div>
         <FiltersBarSection />
    </section>
  );
}
export default HeroClubsPage;