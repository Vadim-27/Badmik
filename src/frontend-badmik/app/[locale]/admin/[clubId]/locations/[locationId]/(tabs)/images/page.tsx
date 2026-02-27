import { getTranslations } from 'next-intl/server';

import RQHydrate from '@/services/_shared/RQHydrate';
import { prefetch } from '@/services/_shared/prefetch';
import { locationMediaServerQueries } from '@/services/locationMedia/queries.server';

import LocationImagesScreen from '@/app/components/shared/Locations/LocationImages/LocationImagesScreen/LocationImagesScreen';

// якщо у тебе вже є server queries для media — підключиш тут
// import { locationMediaServerQueries } from '@/services/locationMedia/queries.server';

type Params = { locale: string; clubId: string; locationId: string };

export default async function LocationImagesPage({ params }: { params: Params }) {
  const { locale, clubId, locationId } = await params;

  await getTranslations({ locale, namespace: 'locationImages' });



  const state = await prefetch([
  locationMediaServerQueries.logo(locationId),
  locationMediaServerQueries.images(locationId),
]);

  return (
    <RQHydrate state={state}>
      <div className="pt-0  w-full  ">
        <LocationImagesScreen clubId={clubId} locationId={locationId} />
      </div>
    </RQHydrate>
  );
}
