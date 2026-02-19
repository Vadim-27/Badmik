

import { getTranslations } from 'next-intl/server';

import RQHydrate from '@/services/_shared/RQHydrate';
import { prefetch } from '@/services/_shared/prefetch';

import { playersServerQueries } from '@/services/players/queries.server';
import { playerMembershipsServerQueries } from '@/services/playerMemberships/queries.server';

import { buildHrefServer } from '@/lib/club-scope.server';
import PlayerMembershipsPageClient from '@/app/components/shared/Players/PlayerMemberships/PlayerMembershipsPageClient';

type Params = { locale: string; clubId: string; playerId: string };

export default async function PlayerMembershipsPage({ params }: { params: Params }) {
  const { locale, clubId, playerId } = await params;

  const tAH = await getTranslations({ locale, namespace: 'ActionHeader.title' });
  const tBC = await getTranslations({ locale, namespace: 'playersBreadcrumbs' });

  const playerQuery = playersServerQueries.byId(playerId);
  const playerDto = await playerQuery.queryFn();

  const state = await prefetch([
    playersServerQueries.byId(playerId),
    playerMembershipsServerQueries.list({ playerId, clubId }),
  ]);

  const dashboardHref = buildHrefServer(clubId, 'dashboard');
  const playersHref = buildHrefServer(clubId, 'players');
  const playerHref = buildHrefServer(clubId, `players/${playerId}`);

  const breadcrumbs = [
    { label: tBC('Admin'), href: dashboardHref },
    { label: tBC('Players'), href: playersHref },
    { label: playerDto?.user?.fullName ?? '—', href: playerHref },
    { label: tBC('PlayerMemberships') },
  ];

  return (
    <RQHydrate state={state}>
      <PlayerMembershipsPageClient
        // title={`${tAH('playerMembershipsHeader')} ${playerDto?.user?.fullName ?? '—'}`}
        // breadcrumbs={breadcrumbs}
        clubId={clubId}
        playerId={playerId}
      />
    </RQHydrate>
  );
}

