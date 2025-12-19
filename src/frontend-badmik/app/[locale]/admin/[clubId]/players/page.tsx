import UserTable from '@/app/components/shared/Players/PlayerTable/PlayerTable';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';
import { buildHrefServer } from '@/lib/club-scope.server';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

import { getTranslations } from 'next-intl/server';

type Params = {
  locale: string;
  clubId?: string; 
};

const UsersClub = async ({
  params,
}: {
  params: Params; 
}) => {
  const {  locale, clubId } = await params;
  const t = await getTranslations({locale, namespace: 'ActionHeader.title'});

  const addHref = buildHrefServer(clubId, 'players/add-player');
  

  return (
    <div className="p-4 w-full h-screen">
      <ActionHeader>
        <BackButton label="buttons.back"/>
        <h2 className="text-lg font-semibold">{t('usersHeader')}</h2>
        <AddButton href={addHref} label="buttons.addPlayer" />
        </ActionHeader>

        <AppBreadcrumbs 
              items={[
                { label: 'Admin', href: '/admin/players' },
                { label: 'Players' },
              ]}
            />
    
      <UserTable />
    </div>
  );
}   
export default UsersClub;
