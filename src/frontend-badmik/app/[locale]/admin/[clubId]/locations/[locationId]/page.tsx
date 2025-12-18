import { notFound } from 'next/navigation';

import LocationDetails from '@/app/components/shared/Locations/LocationDetails/LocationDetails';
import type { Location } from '@/services/types/locations.dto';
import type { Club } from '@/services/types/clubs.dto';

import { locationsApiServer } from '@/services/locations/api.server';
import { clubsApiServer } from '@/services/clubs/api.server';

type Params = {
  locationId: string;
};

export default async function LocationPage({ params }: { params: Params }) {
  const { locationId } = await params;

  let location: Location | null = null;

  try {
    location = await locationsApiServer.byId(locationId);
  } catch (e) {
    console.error('[SSR] locationsApiServer.byId failed:', e);
    location = null;
  }

  if (!location) return notFound();

  // ✅ підтягнемо клуб для назви (бо у Location тільки clubId)
  let club: Club | null = null;
  try {
    if ((location as any).clubId) {
      club = await clubsApiServer.byId((location as any).clubId);
    }
  } catch (e) {
    console.warn('[SSR] clubsApiServer.byId failed (optional):', e);
    club = null;
  }

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <LocationDetails location={location} club={club} />
    </main>
  );
}
