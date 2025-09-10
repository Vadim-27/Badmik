import HeroHomePage from "./components/shared/Hero/HeroHomePage/HeroHomePage";
// import FiltersBarSection from "./components/shared/FiltersBar/FiltersBarSection";
import ClubsList from "./components/shared/Clubs/ClubsList/ClubsList"; 
import TrainingFormats from "./components/shared/TrainingFormats/TrainingFormats";
import PlayerLevels from "./components/shared/PlayerLevels/PlayerLevels";
import ScheduleTraining from "./components/shared/ScheduleTraining/ScheduleTraining";
import Tournaments from "./components/shared/Tournaments/Tournaments";
import Reviews from "./components/shared/Reviews/Reviews";

export default function Home() {
  return (
    <main>
      <div>
        <HeroHomePage />
        {/* <FiltersBarSection /> */}
        <ScheduleTraining />
        <ClubsList />
        <TrainingFormats />
        <PlayerLevels />
        <Tournaments />
        <Reviews />

   
      </div>
    </main>
  );
}
