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

const AccessPage = async ({
  params,
}: {
  params: { locale: string};
}) => {
  const {  locale } = await params;
  const t = await getTranslations({locale, namespace: 'ActionHeader.title'});

    const state = await prefetch([
    roleServerQueries.list(),
    staffServerQueries.list(),
  ]);
  
  // const staff = await srvStaffList();
  // console.log("staff  = back", staff);
    return (
      <RQHydrate state={state}>
    <div className="p-4 w-full h-screen">
        <ActionHeader>
        <BackButton label="buttons.back"/>
        <h2 className="text-lg font-semibold">{t('employeeHeader')}</h2>
        <AddButton href={`/admin/access-control/add-staff`} label="buttons.addUser" />
        </ActionHeader>
        <StaffTable />
    </div>
    </RQHydrate>
);
}
export default AccessPage;