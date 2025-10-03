import UserTable from '@/app/components/shared/players/UserTable/UserTable';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';

import { getTranslations } from 'next-intl/server';

const UsersClub = async ({
  params,
}: {
  params: { locale: string};
}) => {
  const {  locale } = await params;
  const t = await getTranslations({locale, namespace: 'ActionHeader.title'});
  

  return (
    <div className="p-4 w-full h-screen">
      <ActionHeader>
        <BackButton label="buttons.back"/>
        <h2 className="text-lg font-semibold">{t('usersHeader')}</h2>
        <AddButton href={`/admin/players/add-player`} label="buttons.addPlayer" />
        </ActionHeader>
    
      <UserTable />
    </div>
  );
}   
export default UsersClub;
