import { notFound } from 'next/navigation';

import RQHydrate from '@/services/_shared/RQHydrate';
import { prefetch } from '@/services/_shared/prefetch';

import EditPlayer from '@/app/components/shared/Players/EditPlayer/EditPlayer';
import { playersServerQueries } from '@/services/players/queries.server';
import { Player } from '@/services/types/players.dto';

type Params = {
  playerId: string;
  clubId: string;
  
};

export default async function PlayerEditPage({ params }: { params: Params }) {
  const { playerId, clubId } = await params;


  const state = await prefetch([
    playersServerQueries.byId(playerId),
    
  ]);

  

  return (
    <RQHydrate state={state}>
      <div className="pt-0 p-4 w-full">
        <EditPlayer 
        clubIdParams={clubId} 
        playerId={playerId} />
      </div>
    </RQHydrate>
  );
}

