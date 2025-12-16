import { notFound } from 'next/navigation';
import type { Location } from '@/services/types/locations.dto';
import { locationsApiServer } from '@/services/locations/api.server';
import EditLocation from '@/app/components/shared/Locations/EditLocation/EditLocation';

type PageProps = {
  params: { locale: string; locationId: string };
};

export default async function EditLocationPage({
  params: { locale, locationId },
}: PageProps) {
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
      <EditLocation locationId={locationId} initialData={location} />
    </div>
  );
}
