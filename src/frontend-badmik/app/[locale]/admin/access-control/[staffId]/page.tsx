// app/[locale]/admin/access-control/[staffId]/page.tsx
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import EditStaff from '@/app/components/shared/Staff/EditStaff/EditStaff';
import { srvStaffById } from '@/services/server/staff.server';

//===============================================================
import RQHydrate from '@/services/_shared/RQHydrate';
import { prefetch } from '@/services/_shared/prefetch';
import { roleServerQueries } from '@/services/role/queries.server';
//==========================================================================

type PageProps = {
  params: { locale: string; staffId: string }; // ⬅️ НЕ Promise!
};

export default async function StaffPage({ params: { locale, staffId } }: PageProps) {
   const state = await prefetch([ roleServerQueries.list() ]);
  console.log('[SSR] params:', { locale, staffId });

  // const t = await getTranslations({ locale, namespace: 'ActionHeader.title' });

  const staff = await srvStaffById(staffId).catch((e) => {
    console.error('[SSR] srvStaffById failed:', e);
    return null;
  });

  console.log('[SSR] staff:', staff);

  if (!staff) return notFound();

  return (
    <RQHydrate state={state}>
    <div className="p-4 w-full min-h-screen">
      {/* передаємо початкові дані в клієнтський компонент */}
      {/* <EditStaff staffId={staffId} initialData={staff} title={t('editUserHeader')} /> */}
      <EditStaff staffId={staffId} initialData={staff}  />
    </div>
    </RQHydrate>
  );
}


