import { notFound } from 'next/navigation';

import LocationDetails from '@/app/components/shared/Locations/LocationDetails/LocationDetails';
import type { Location } from '@/services/types/locations.dto';
import type { Club } from '@/services/types/clubs.dto';

import { locationsApiServer } from '@/services/locations/api.server';
import { clubsApiServer } from '@/services/clubs/api.server';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

type Params = {
  locationId: string;
  clubId: string;
};

export default async function LocationPage({ params }: { params: Params }) {
  const { locationId, clubId } = await params;

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
    <main className="pt-0 p-4 bg-gray-100">
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h1 className="text-lg font-semibold">
          {location.name || 'Локація без назви'}
        </h1>

        {/* ✅ поправ шлях, якщо у тебе інша структура */}
        <EditButton href={`/admin/${clubId}/locations/${locationId}/edit-location`} label="buttons.update" />
      </ActionHeader>

      
        <AppBreadcrumbs
          items={[
            { label: 'Admin', href: '/admin/dashboard' },
            { label: 'Locations', href: `/admin/${clubId}/locations/` },
            { label: 'Location' },
          ]}
        />
     
      <LocationDetails location={location} club={club} />
    </main>
  );
}
