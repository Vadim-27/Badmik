import { notFound } from 'next/navigation';
import type { Location } from '@/services/types/locations.dto';
import { locationsApiServer } from '@/services/locations/api.server';
import EditLocation from '@/app/components/shared/Locations/EditLocation/EditLocation';

type Params = {
  locationId: string;
  clubId: string;
};

export default async function EditLocationPage({ params }: { params: Params }) {
  const { locationId, clubId } = await params;
  let location: Location | null = null;

  try {
    location = await locationsApiServer.byId(locationId);
  } catch (e) {
    console.error('[SSR] locationsApiServer.byId failed:', e);
    location = null;
  }

  if (!location) {
    return notFound();
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <EditLocation clubIdParams={clubId} locationId={locationId} initialData={location} />
    </div>
  );
}
