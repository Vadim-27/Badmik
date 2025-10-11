"use client";


import { useParams } from "next/navigation";
import InfoAboutClub from "./InfoAboutClub/InfoAboutClub";
import TrainingSchedule from "./TrainingSchedule/TrainingSchedule";
import CoachesClub from "./CoachesClub/CoachesClub";
import ClubGalleryPhoto from "./ClubGalleryPhoto/ClubGalleryPhoto";
import data from "@/data/ourListClubs.json";


const ProfileClub = () => {
    const params = useParams();
  const clubIdFromPath = (params?.clubId as string) || "";
  const club = data.clubs.find((club) => club.id === clubIdFromPath);
  if (!club) {
    return (
      <div style={{ padding: 16 }}>
        Клуб не знайдено або видалений.
      </div>
    );
  }
  return (
    <>
        <InfoAboutClub  club={club}/>
        <TrainingSchedule />
        <CoachesClub />
        <ClubGalleryPhoto />
    </>
  );
}
export default ProfileClub;