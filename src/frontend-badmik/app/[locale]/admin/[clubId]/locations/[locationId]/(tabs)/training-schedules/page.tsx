import type { ReactElement } from 'react';

// import { prefetch } from '@/services/_shared/prefetch';
// import RQHydrate from '@/services/_shared/RQHydrate';
// import { trainingSchedulesServerQueries } from '@/services/trainingSchedules/queries.server';

import TrainingSchedules from '@/app/components/shared/TrainingSchedules/TrainingSchedules';

type Params = { locale: string; clubId: string; locationId: string };

export default async function TrainingSchedulesPage({
  params,
}: {
  params: Promise<Params>;
}): Promise<ReactElement> {
  const { clubId, locationId } = await params;


  // TODO: підключимо коли будемо тягнути дані
  // const dehydratedState = await prefetch([
  //   trainingSchedulesServerQueries.activeByClub(clubId),
  // ]);

  // return (
  //   <RQHydrate state={dehydratedState}>
  //     <TrainingSchedules clubId={clubId} />
  //   </RQHydrate>
  // );

  return <TrainingSchedules clubId={clubId} locationId={locationId} />;
}