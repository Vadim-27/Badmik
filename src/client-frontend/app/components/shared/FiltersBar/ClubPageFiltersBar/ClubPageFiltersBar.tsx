import InfoClub from "@/app/assets/icons/InfoClub.svg";
import CalendarBlackClub from "@/app/assets/icons/CalendarBlackClub.svg";
import TrainersBlackClub from "@/app/assets/icons/YoungManTrainerClub.svg";
import VirtualTourBlackClub from "@/app/assets/icons/ArrowUDownRightClub.svg";

import css from "./ClubPageFiltersBar.module.scss";

const ClubPageFiltersBar = () => {
  return (
    <section className={`${css.sectionFilterBar} `}>
      <ul className={css.infoClubList}>
        <li className={css.infoClubItem}>
            <InfoClub className={css.iconInfoClub} aria-hidden />
            <p className={css.infoClubItemText}>Інформація про клуб</p>
        </li>
        <li className={css.infoClubItem}>
            <CalendarBlackClub className={css.iconInfoClub} aria-hidden />
            <p className={css.infoClubItemText}>Розклад групових занять</p>
        </li>
        <li className={css.infoClubItem}>
            <TrainersBlackClub className={css.iconInfoClub} aria-hidden />
            <p className={css.infoClubItemText}>Тренери клубу</p>
        </li>
        <li className={css.infoClubItem}>
            <VirtualTourBlackClub className={css.iconInfoClub} aria-hidden />
            <p className={css.infoClubItemText}>Віртуальний 360 тур</p>
        </li>
      </ul>
   
    </section>
  );
};

export default ClubPageFiltersBar;
