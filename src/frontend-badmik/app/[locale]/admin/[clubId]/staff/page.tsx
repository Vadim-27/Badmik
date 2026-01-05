import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import StaffTable from '@/app/components/shared/Staff/StaffTable/StaffTable';
import { getTranslations } from 'next-intl/server';
import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';

import { srvStaffList } from "@/services/server/staff.server";

import RQHydrate from '@/services/_shared/RQHydrate';
import { prefetch } from '@/services/_shared/prefetch';
import { roleServerQueries } from '@/services/role/queries.server';
import { staffServerQueries } from '@/services/staff/queries.server';
import { buildHrefServer } from '@/lib/club-scope.server';


type Params = {
  locale: string;
  clubId: string; 
};


const StaffPage = async ({
  params,
}: {
  params: Params; 
}) => {
  const {  locale, clubId } = await params;
  const t = await getTranslations({locale, namespace: 'ActionHeader.title'});

    const state = await prefetch([
   roleServerQueries.listByClub(clubId),
    // staffServerQueries.list(),
    staffServerQueries.list({ clubId, page: 1, pageSize: 10 }),
  ]);
  
  const addHref = buildHrefServer(clubId, 'staff/add-staff');

    return (
      <RQHydrate state={state}>
    <div className="pt-0 p-4 w-full ">
        <ActionHeader>
        <BackButton label="buttons.back"/>
        <h2 className="text-lg font-semibold">{t('employeeHeader')}</h2>
        <AddButton 
        href={addHref}
        label="buttons.addUser" />
        </ActionHeader>
        <StaffTable clubId={clubId} />
    </div>
    </RQHydrate>
);
}
export default StaffPage;