import { clubs } from '@/data/clubs';
import ClubEditForm from '@/app/components/shared/Clubs/ClubEditForm/ClubEditForm';

type Params = {
  clubId: string;
};

export default async function EditClubPage({
  params,
}: {
  params: Promise<Params>;
}) {
 const { clubId } = await params; // правильно чекаємо
  const club = clubs.find((c) => c.id === clubId);

  if (!club) {
    return <div>Клуб не знайдено</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* <h1 className="text-xl font-bold mb-4">Редагування клубу</h1> */}
      <ClubEditForm club={club} />
    </div>
  );
}