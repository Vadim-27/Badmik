// import { Link } from '@/i18n/navigation';
// import { clubs } from '@/data/clubs';
// import { ClubList } from '../../../components/shared/Clubs/ClubList/ClubList';
import ClubListHeader from '../../../components/shared/Clubs/ClubListHeader/ClubListHeader';
import React from 'react';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
import NewClubList from '@/app/components/shared/Clubs/NewClubList/NewClubList';

import { prefetch } from '@/services/_shared/prefetch';
import RQHydrate from '@/services/_shared/RQHydrate';
import { clubsServerQueries } from '@/services/clubs/queries.server';

const AdminPage = async () => {
  // один раз на сервері підтягуємо список без фільтра
  const state = await prefetch([
    clubsServerQueries.list(/* filter */ undefined),
  ]);
  return (
     <RQHydrate state={state}>
    <div className="admin-page bg-gray-100 p-6">
     
        <ClubListHeader />
        <AppBreadcrumbs className="pl-[10px] pb-6"
              items={[
                { label: 'Admin', href: '/admin/clubs' },
                { label: 'Clubs' },
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
