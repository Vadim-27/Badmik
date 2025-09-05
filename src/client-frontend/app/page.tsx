import ClubsList from "./components/shared/Clubs/ClubsList/ClubsList"; 
import TrainingFormats from "./components/shared/TrainingFormats/TrainingFormats";
import PlayerLevels from "./components/shared/PlayerLevels/PlayerLevels";
import ScheduleTraining from "./components/shared/ScheduleTraining/ScheduleTraining";
import Tournaments from "./components/shared/Tournaments/Tournaments";

export default function Home() {
  return (
    <main>
      <div>
        <ScheduleTraining />
        <ClubsList />
        <TrainingFormats />
        <PlayerLevels />
        <Tournaments />
   
      </div>
    </main>
  );
}
