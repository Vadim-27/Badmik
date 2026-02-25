import React from 'react';
import UserDetail from '@/app/components/shared/Players/PlayerDetail/PlayerDetail';

import { playersServerQueries } from '@/services/players/queries.server';
import RQHydrate from '@/services/_shared/RQHydrate';
import { prefetch } from '@/services/_shared/prefetch';

type Params = {
  playerId: string;
  clubId: string;
};

const PlayerPage = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
  const { playerId, clubId } = await params;

const state = await prefetch([ playersServerQueries.byId(playerId) ]);

// const player = playersServerQueries.byId(playerId)
 
 
  // if (!player) return <div>User not found</div>;

  return (
  <RQHydrate state={state}>
    <div className=" bg-gray-100 min-h-screen">
  {/* <UserDetail player={player} /> */}
  <UserDetail playerId={playerId} clubIdParams={clubId} />
  </div>
  </RQHydrate>
);
};

export default PlayerPage;
