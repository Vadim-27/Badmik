// src/services/playerMemberships/queries.server.ts
import 'server-only';
import { qk } from '@/services/_shared/queryKeys';
import { playerMembershipsApiServer } from './api.server';

type ListParams = {
  playerId: string;
  clubId?: string;
};

export const playerMembershipsServerQueries = {
  list: (params: ListParams) => ({
    queryKey: qk.playerMemberships.list(params),
    queryFn: () => playerMembershipsApiServer.list(params),
  }),

  byId: (playerId: string, membershipId: string) => ({
    queryKey: qk.playerMemberships.byId(playerId, membershipId),
    queryFn: () => playerMembershipsApiServer.byId(playerId, membershipId),
  }),
};
