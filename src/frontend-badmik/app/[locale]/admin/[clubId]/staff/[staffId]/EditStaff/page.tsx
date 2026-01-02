
// app/[locale]/admin/[clubId]/Staff/[staffId]/EditStaff/page.tsx
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import EditStaff from '@/app/components/shared/Staff/EditStaff/EditStaff';
import { srvStaffById } from '@/services/server/staff.server';

//===============================================================
import RQHydrate from '@/services/_shared/RQHydrate';
import { prefetch } from '@/services/_shared/prefetch';
import { roleServerQueries } from '@/services/role/queries.server';
//==========================================================================

type Params = {
  staffId: string;
  clubId: string;
};
export default async function StaffEditPage({ params }: { params: Params }) {
  //  const state = await prefetch([ roleServerQueries.list() ]);
  const { staffId, clubId } = await params;
  console.log('[SSR] params:прпр', {  staffId });

  // const t = await getTranslations({ locale, namespace: 'ActionHeader.title' });

  const staff = await srvStaffById(staffId).catch((e) => {
    console.error('[SSR] srvStaffById failed:', e);
    return null;
  });

  console.log('[SSR] staff:', staff);

  if (!staff) return notFound();

  //  const clubId: string | null = staff.clubId ?? null;
     const state = await prefetch(
    clubId ? [roleServerQueries.listByClub(clubId)] : []
  );
  console.log('[SSR] params:', { staffId, clubId });

  return (
    <RQHydrate state={state}>
    <div className="p-4 w-full min-h-screen">
      {/* передаємо початкові дані в клієнтський компонент */}
      {/* <EditStaff staffId={staffId} initialData={staff} title={t('editUserHeader')} /> */}
      <EditStaff clubIdParams={clubId} staffId={staffId} initialData={staff}  />
    </div>
    </RQHydrate>
  );
}
