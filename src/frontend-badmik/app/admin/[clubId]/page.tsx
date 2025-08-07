import { notFound } from 'next/navigation';
import { clubs } from '@/data/clubs';
import { ClubDetails } from '@/app/components/shared/Clubs/ClubDetails/ClubDetails';
import { ClubPageHeader } from '@/app/components/shared/Clubs/ClubPageHeader/ClubPageHeader';
import Link from 'next/link';

type Props = {
  params: {
    clubId: string;
  };
};


export  function generateStaticParams() {
  return clubs.map((club) => ({
    clubId: club.id,
  }));
}

export default  function ClubAdminPage({ params }: Props) {
  const club = clubs.find((c) => c.id === params.clubId);

  if (!club) {
    notFound();
  }

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      {/* <div className="bg-gray-100 h-100vh"> */}
      <ClubPageHeader club={club} />
      <ClubDetails club={club}/>
      {/* </div> */}
      {/* <div className="p-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{club.name}</h1>
          <span
            className={`text-sm px-3 py-1 rounded-full bg-${club.statusColor}-100 text-${club.statusColor}-700`}
          >
            {club.status}
          </span>
        </div>

        <div className="text-gray-700 text-sm space-y-2 mb-6">
          <p><strong>Місто:</strong> {club.city}</p>
          <p><strong>Адреса:</strong> {club.address}</p>
          <p><strong>Менеджер:</strong> {club.manager}</p>
          <p><strong>Кількість кортів:</strong> {club.courts}</p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/admin/${club.id}/edit`}
            className="px-4 py-2 bg-secondary-button hover:bg-secondary-button-hover text-white text-sm rounded"
          >
            ✏️ Редагувати
          </Link>
          <button className="px-4 py-2 bg-delete-button hover:bg-delete-button-hover text-white text-sm rounded">
            🗑️ Видалити
          </button>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded"
          >
            ← Назад до списку клубів
          </Link>
        </div>
      </div>
    </div> */}
    </main>
  );
}