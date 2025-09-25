import HeroClubsPage from "../components/shared/Hero/HeroClubsPage/HeroClubsPage";
import OurClubsList from "../components/shared/Clubs/OurClubsList/OurClubsList";

export default function ClubsPage() {
  return (
    <main>
      <div>
        <HeroClubsPage />
        <OurClubsList />
      </div>
    </main>
  );
}