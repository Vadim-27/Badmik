// import { Link } from '@/i18n/navigation';
// import { clubs } from '@/data/clubs';
// import { ClubList } from '../../../components/shared/Clubs/ClubList/ClubList';
import ClubListHeader from '../../../components/shared/Clubs/ClubListHeader/ClubListHeader';
import React, { use } from 'react';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
import NewClubList from '@/app/components/shared/Clubs/NewClubList/NewClubList';

import { prefetch } from '@/services/_shared/prefetch';
import RQHydrate from '@/services/_shared/RQHydrate';
import { clubsServerQueries } from '@/services/clubs/queries.server';
import { getTranslations } from 'next-intl/server';

const AdminPage = async ({ params }: { params: { locale: string; clubId: string } }) => {
 
const { locale } = await params;

  const state = await prefetch([
    clubsServerQueries.list(/* filter */ undefined),
  ]);


  const t = await getTranslations({ locale, namespace: 'clubsBreadcrumbs' });


  return (
     <RQHydrate state={state}>
    <div className="admin-page bg-gray-100 pt-0 p-4 ">
     
        <ClubListHeader />
        <AppBreadcrumbs
          items={[
            { label: t('Admin'), href: '/admin/clubs' },
            { label: t('Clubs') },
          ]}
        />

        {/* <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
          <ClubList />
        </div> */}
       <NewClubList  /> 

      
    </div>
    </RQHydrate>
  );
};

export default AdminPage;
