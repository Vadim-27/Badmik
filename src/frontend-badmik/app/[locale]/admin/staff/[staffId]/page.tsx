
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import StaffDetails from '@/app/components/shared/Staff/StaffDetails/StaffDetails';
import { staffServerQueries } from '@/services/staff/queries.server';
import { clubsServerQueries } from '@/services/clubs/queries.server';

type Params = {
  staffId: string;
  clubId: string;
};

export default async function StaffPage({ params }: { params: Params }) {
  const { staffId, clubId } = await params;

 

  const qc = new QueryClient();

  // staff
  await qc.prefetchQuery(staffServerQueries.byId(staffId ));

  // club (щоб показати назву)
  await qc.prefetchQuery(clubsServerQueries.byId(clubId));

  const state = dehydrate(qc);

  // дістаємо дані одразу (без client fetch)
  const staff = qc.getQueryData(staffServerQueries.byId(staffId ).queryKey) as any;
  const club = qc.getQueryData(clubsServerQueries.byId(clubId).queryKey) as any;

  return (
    <HydrationBoundary state={state}>
      <StaffDetails staff={staff} club={club} />
    </HydrationBoundary>
  );
}



