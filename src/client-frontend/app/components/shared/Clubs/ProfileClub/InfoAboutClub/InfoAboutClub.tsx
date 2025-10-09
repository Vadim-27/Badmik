import { Club } from "@/types/ourClubsList";
import FootballField from "@/app/assets/icons/FootballField.svg";
import Parking from "@/app/assets/icons/Parking.svg";
import WaterDrop from "@/app/assets/icons/WaterDrop.svg";
import AirConditioner from "@/app/assets/icons/AirConditioner.svg";
import Columns from "@/app/assets/icons/Columns.svg";
import Shower from "@/app/assets/icons/Shower.svg";
import Tennis from "@/app/assets/icons/Tennis.svg";
import SwimmingPool from "@/app/assets/icons/SwimmingPool.svg";
import Spa from "@/app/assets/icons/spa.svg";
import Gym from "@/app/assets/icons/Gym.svg";
import Group from "@/app/assets/icons/Group.svg";
import Map from "@/app/assets/icons/Map.svg";
import CalendarClubPage from "@/app/assets/icons/CalendarClubPage.svg";
import IdCard from "@/app/assets/icons/IdCard.svg";
import css from "./InfoAboutClub.module.scss";


type Props = {
  club: Club;
};

const InfoAboutClub = ({ club }: Props) => {
  console.log("   club", club);
  const {
    courts,
    flooring,
    water,
    parking,
    airConditioning,
    swimmingPool,
    squashCenter,
    laserSpa,
    trainingsRoom,
    groupClasses,
    showers,
  } = club.features;
  return (
    <section className="containerPage">
      <div className={css.wrapper}>
        <div className={css.infoClubFeatures}>
          <h2 className={css.titleSection}>Інформація про клуб</h2>
          <p className={css.textClub}>
            {club.name} – це справжній спортивний палац на лівому березі Києва з
            широким спектром фітнес- та wellness послуг
          </p>
          <ul className={css.featuresList}>
            {courts && (
              <li className={css.item}>
                <div className={css.wrapperIcon}>
                <FootballField className={css.featureIcon} aria-hidden />
                </div>
                <div>
                <span className={css.itemCount}>{courts}</span>
                <p className={css.itemNameFeatures}>Кількість кортів: </p>
                </div>
              </li>
            )}
            {parking&& 
            <li className={css.item}>
                <div className={css.wrapperIcon}>
                <Parking className={css.featureIcon} aria-hidden />
                </div>
                <div>
                <span className={css.itemCount}>Є</span>
                <p className={css.itemNameFeatures}>Парковка</p>
              </div>
                </li>}
            {flooring && <li className={css.item}>
                <div className={css.wrapperIcon}>
                <Columns className={css.featureIcon} aria-hidden />
                </div>
                <div>
                <span className={css.itemCount}>Є</span>
                <p className={css.itemNameFeatures}>Вінілове покриття</p>
                </div>
                </li>}
            {showers&&
            <li className={css.item}>
                <div className={css.wrapperIcon}>
                <Shower className={css.featureIcon} aria-hidden />
                </div>
                <div>
                <span className={css.itemCount}>Є</span>
                <p className={css.itemNameFeatures}>Душові</p>
                </div>
                </li>}
            {water&&
            <li className={css.item}>
                <div className={css.wrapperIcon}>
                <WaterDrop className={css.featureIcon} aria-hidden />
                </div>
                <div>
                <span className={css.itemCount}>Є</span>
                <p className={css.itemNameFeatures}>Питна вода</p>
                </div>
                </li>
                }
            {airConditioning&&
            <li className={css.item}>
                <div className={css.wrapperIcon}>
                <AirConditioner className={css.featureIcon} aria-hidden />
                </div>
                <div>
                <span className={css.itemCount}>Є</span>
                <p className={css.itemNameFeatures}>Кондиціонер</p>
                </div>
                </li>}
            {swimmingPool&&
            <li className={css.item}>
                <div className={css.wrapperIcon}>
                <SwimmingPool className={css.featureIcon} aria-hidden />
                </div>
                <div>
                <span className={css.itemCount}>Є</span>
                <p className={css.itemNameFeatures}>Басейн</p>
                </div>
                </li>}
            {squashCenter&&
            <li className={css.item}>
                <div className={css.wrapperIcon}>
                <Tennis className={css.featureIcon} aria-hidden />
                </div>
                <div>
                <span className={css.itemCount}>Є</span>
                <p className={css.itemNameFeatures}>Сквош центр</p>
                </div>
                </li>}
            {laserSpa&&
            <li className={css.item}>
                <div className={css.wrapperIcon}>
                <Spa className={css.featureIcon} aria-hidden />
                </div>
                <div>
                <span className={css.itemCount}>Є</span>
                <p className={css.itemNameFeatures}>Лазерний спа</p>
                </div>
                </li>}
            {trainingsRoom&&
            <li className={css.item}>
                <div className={css.wrapperIcon}>
                <Gym className={css.featureIcon} aria-hidden />
                </div>
                <div>
                <span className={css.itemCount}>Є</span>
                <p className={css.itemNameFeatures}>Тренажерний зал</p>
                </div>
                </li>}
            {groupClasses&&
            <li className={css.item}>
                <div className={css.wrapperIcon}>
                <Group className={css.featureIcon} aria-hidden />
                </div>
                <div>
                <span className={css.itemCount}>Є</span>
                <p className={css.itemNameFeatures}>Групові заняття</p>
                </div>
                </li>}
          </ul>
        </div>
        <div className={css.additionalInfo}>
            <div className={css.scheduleWrapper}>
                <h3 className={css.titleContacts}>Графік роботи</h3>
                <p className={css.nameDay}>Щодня:</p>
                <div className={css.schedule}>
                    <div className={css.iconWrapper}>
                    <CalendarClubPage className={css.iconContacts} aria-hidden />
                    </div>
                    <div className={css.scheduleWrapperWorkTime}>
                        <p className={css.scheduleWorkText}>Пн-Пт 07:00–22:00</p>
                        <p className={css.scheduleWorkText}>Сб-Нд 09:00–20:00</p>
                    </div>
                </div>
            </div>
            <div className={css.scheduleWrapper}>
                <h3 className={css.titleContacts}>Адреса</h3>
                <div className={css.schedule}>
                    <div className={css.iconWrapper}>
                <Map className={css.iconContacts} aria-hidden />
                </div>
                <p className={css.scheduleWorkText}>{club.address}</p>
                </div>
            </div>
            
            <div className={css.scheduleWrapper}>
                <h3 className={css.titleContacts}>Контакти</h3>
                <div className={css.schedule}>
                    <div className={css.iconWrapper}>
                <IdCard className={css.iconContacts} aria-hidden />
                </div>
                <p className={css.scheduleWorkText}>Доступні карти різних рівнів, такі як Sport, Sport + Pool, Premium, Premium Sport, Lux & SPA</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};
export default InfoAboutClub;
