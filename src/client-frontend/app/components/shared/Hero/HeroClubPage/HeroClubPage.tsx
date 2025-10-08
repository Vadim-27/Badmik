// "use client";

// import { useParams } from 'next/navigation'
// import Header from "../../Header/Header";
// import FiltersBarSection from "../../FiltersBar/ClubsPageFiltersBar/FiltersBarSection";
// import AppBreadcrumbs from "@/app/components/ui/AppBreadcrumbs/AppBreadcrumbs";
// import MapIcon from "@/app/assets/icons/Map.svg";

// import data from "@/data/ourListClubs.json";

// import styles from "./HeroClubPage.module.scss";

// const HeroClubPage = () => {

//  const params = useParams();
//   const clubIdFromPath = (params?.clubId as string) || '';

//     const club = data.clubs.find((club) => club.id === clubIdFromPath);

//   return (
//     <section className={styles.hero}>
//         <Header />
//         <div className={styles.breadcrumbsWrapper}>
//              <AppBreadcrumbs
//           overrides={
//             club
//               ? { [`/clubs/${clubIdFromPath}`]: club.name } 
//               : undefined
//           }
//         />
//         </div>
        
//         <div className={styles.containerHero}>
            
           
//             <div className={styles.contentHero}>
//                 <h1 className={styles.titleHero}>{club?.name}</h1>
//                 <div className={styles.addressWrapper}>
//                     <MapIcon className={styles.MapIcon} aria-hidden />
//                     <p className={styles.textHero}>{club?.address}</p>
//                 </div>
                
             
//             </div>
         
           
//         </div>
//          <FiltersBarSection />
//     </section>
//   );
// }
// export default HeroClubPage;

"use client";


import { useParams } from "next/navigation";
import Header from "../../Header/Header";
import FiltersBarSection from "../../FiltersBar/ClubPageFiltersBar/ClubPageFiltersBar";
import AppBreadcrumbs from "@/app/components/ui/AppBreadcrumbs/AppBreadcrumbs";
import MapIcon from "@/app/assets/icons/Map.svg";

import data from "@/data/ourListClubs.json";

import styles from "./HeroClubPage.module.scss";

const HeroClubPage = () => {
  const params = useParams();
  const clubIdFromPath = (params?.clubId as string) || "";
  const club = data.clubs.find((club) => club.id === clubIdFromPath);


const normalizeUrl = (u?: string) =>
  u ? (u.startsWith("http") ? u : `/${u.replace(/^\/+/, "")}`) : "";

const bg = normalizeUrl(club?.image);
  return (
    <section className={styles.hero}
    //  style={heroStyle}
     style={{ "--hero-bg": `url("${bg}")` } as React.CSSProperties}
     >
      <Header />

      <div className={styles.breadcrumbsWrapper}>
        <AppBreadcrumbs
          overrides={club ? { [`/clubs/${clubIdFromPath}`]: club.name } : undefined}
        />
      </div>

      <div className={styles.containerHero}>
        <div className={styles.contentHero}>
          <h1 className={styles.titleHero}>
            {club?.name ?? "Клуб"}
          </h1>

          <div className={styles.addressWrapper}>
            <MapIcon className={styles.MapIcon} aria-hidden />
            <p className={styles.textHero}>{club?.address ?? "Адреса уточнюється"}</p>
          </div>
        </div>
      </div>

      <FiltersBarSection />
    </section>
  );
};

export default HeroClubPage;
