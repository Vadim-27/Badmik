
import { notFound } from 'next/navigation';
import type { Club } from '@/services/types/clubs.dto';
import { clubsApiServer } from '@/services/clubs/api.server';
import EditClub from '@/app/components/shared/Clubs/EditClub/EditClub';

type PageProps = {
  params: { locale: string; clubId: string };
};

type Params = {
  locale: string;
  clubId: string;
};

export default async function EditClubPage({ params }: { params: Params }) {
  const { locale, clubId } = await params;
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
    <div className="pt-0 p-4 bg-gray-100 ">
      <EditClub clubId={clubId} initialData={club} />
    </div>
  );
}
