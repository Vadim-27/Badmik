// src/services/playerMemberships/api.server.ts
import 'server-only';
import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';
import { withQuery } from '@/lib/http/qs';

type ListParams = {
  playerId: string;
  clubId?: string;
};

export const playerMembershipsApiServer = {
  async list(params: ListParams) {
    const url = withQuery(ENDPOINTS.playerMemberships.list(params.playerId), {
      clubId: params.clubId,
    });

    const res = await serverFetch(url, {}, { revalidate: 60, tags: ['playerMemberships'] });
    return res.json();
  },

  async byId(playerId: string, membershipId: string) {
    const res = await serverFetch(
      ENDPOINTS.playerMemberships.byId(playerId, membershipId),
      {},
      { revalidate: 60, tags: ['playerMemberships'] },
    );
    return res.json();
  },
};
