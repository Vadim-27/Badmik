import { notFound } from 'next/navigation';

import ClubDetails from '@/app/components/shared/Clubs/ClubDetails/ClubDetails';
import type { Club } from '@/services/types/clubs.dto';
import { clubsApiServer } from '@/services/clubs/api.server';

type Params = {
  clubId: string;
};

export default async function ClubAdminPage({ params }: { params: Params }) {
 
  const { clubId } = await params;

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
    <main className="pt-0 p-4 bg-gray-100 ">
      <ClubDetails club={club} />
    
    </main>
  );
}
