import { notFound } from 'next/navigation';
import { clubs } from '@/data/clubs';
// import { ClubDetails } from '@/app/components/shared/Clubs/ClubDetails/ClubDetails';
// import { ClubPageHeader } from '@/app/components/shared/Clubs/ClubPageHeader/ClubPageHeader';
import {Link} from '@/i18n/navigation';

// type Props = {
//   params: {
//     clubId: string;
//   };
// };

type Params = {
  clubId: string;
};

// export  function generateStaticParams() {
//   return clubs.map((club) => ({
//     clubId: club.id,
//   }));
// }

export default  async function ClubAdminPage({
  params,
}: {
  params: Promise<Params>;
}) {
  // const club = clubs.find((c) => c.id === params.clubId);
  const { clubId } = await params;
  
  const club = clubs.find((c) => c.id === clubId);

  if (!club) {
    notFound();
  }

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      {/* <div className="bg-gray-100 h-100vh"> */}
      {/* <ClubPageHeader club={club} /> */}
      {/* <ClubDetails club={club}/> */}
      <h1 className="text-2xl font-bold mb-4">Admin Panel for {club.name}</h1>
     
    </main>
  );
}