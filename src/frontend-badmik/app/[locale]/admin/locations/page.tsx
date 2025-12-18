// app/admin/locations/page.tsx  (або з [locale], якщо у вас локалізовані маршрути)

import LocationsList from '@/app/components/shared/Locations/LocationsList/LocationsList';

import { prefetch } from '@/services/_shared/prefetch';
import RQHydrate from '@/services/_shared/RQHydrate';
import { locationsServerQueries } from '@/services/locations/queries.server';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';

import { getTranslations } from 'next-intl/server';
import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';

const LocationsPage = async ({
  params,
}: {
  params: { locale: string};
}) => {
    const {  locale } = await params;
  const t = await getTranslations({locale, namespace: 'ActionHeader.title'});
  const state = await prefetch([
    locationsServerQueries.list(/* clubId */ undefined),
  ]);

  return (
    <RQHydrate state={state}>
      <div className="bg-gray-100 p-6 min-h-screen">
        <ActionHeader>
        <BackButton label="buttons.back"/>
        <h2 className="text-lg font-semibold">
            Локації
            {/* {t('employeeHeader')} */}
            </h2>
        <AddButton href="/admin/locations/add-location"
             label="buttons.addLocation" />
        </ActionHeader>
        <AppBreadcrumbs 
                      items={[
                        { label: 'Admin', href: '/admin/dashboard' },
                        { label: 'Locations' },
                      ]}
                    />
       
        <LocationsList />
      </div>
    </RQHydrate>
  );
};

export default LocationsPage;
