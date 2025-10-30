import React from 'react';
import UserDetail from '@/app/components/shared/Players/PlayerDetail/PlayerDetail';

import { playersServerQueries } from '@/services/players/queries.server';
import RQHydrate from '@/services/_shared/RQHydrate';
import { prefetch } from '@/services/_shared/prefetch';

type Params = {
  playerId: string;
};

const PlayerPage = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
  const { playerId } = await params;
;

const state = await prefetch([ playersServerQueries.byId(playerId) ]);

// const player = playersServerQueries.byId(playerId)
 
 
  // if (!player) return <div>User not found</div>;

  return (
  <RQHydrate state={state}>
    <div className="p-6 bg-gray-100 min-h-screen">
  {/* <UserDetail player={player} /> */}
  <UserDetail playerId={playerId} />
  </div>
  </RQHydrate>
);
};

export default PlayerPage;
