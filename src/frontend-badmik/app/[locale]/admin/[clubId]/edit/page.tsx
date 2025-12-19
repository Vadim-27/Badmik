// // import { clubs } from '@/data/clubs';
// // import ClubEditForm from '@/app/components/shared/Clubs/ClubEditForm/ClubEditForm';
// // import EditClub from '@/app/components/shared/Clubs/EditClub/EditClub';

// type Params = {
//   clubId: string;
// };

// export default async function EditClubPage({
//   params,
// }: {
//   params: Promise<Params>;
// }) {
// //  const { clubId } = await params; 
// //   const club = clubs.find((c) => c.id === clubId);

//   if (!club) {
//     return <div>Клуб не знайдено</div>;
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* <h1 className="text-xl font-bold mb-4">Редагування клубу</h1> */}
//       {/* <ClubEditForm club={club} />
//       <EditClub/> */}
//     </div>
//   );
// }

// app/[locale]/admin/clubs/[clubId]/edit/page.tsx
import { notFound } from 'next/navigation';
import type { Club } from '@/services/types/clubs.dto';
import { clubsApiServer } from '@/services/clubs/api.server';
import EditClub from '@/app/components/shared/Clubs/EditClub/EditClub';

type PageProps = {
  params: { locale: string; clubId: string };
};

export default async function EditClubPage({
  params: { locale, clubId },
}: PageProps) {
  let club: Club | null = null;

  try {
    club = await clubsApiServer.byId(clubId);
  } catch (e) {
    console.error('[SSR] clubsApiServer.byId failed:', e);
    club = null;
  }

  if (!club) {
    return notFound();
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <EditClub clubId={clubId} initialData={club} />
    </div>
  );
}
