// src/services/playerMemberships/api.client.ts
import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';
import { withQuery } from '@/lib/http/qs';

import type {
  PlayerMembership,
  CreatePlayerMembershipDto,
  UpdatePlayerMembershipDto,
} from '@/services/types/playerMemberships.dto';

type ListParams = {
  playerId: string;
  clubId?: string;
};

export const playerMembershipsApiClient = {
  list: (params: ListParams, signal?: AbortSignal) => {
    const url = withQuery(ENDPOINTS.playerMemberships.list(params.playerId), {
      clubId: params.clubId,
    });

    return unwrap<PlayerMembership[]>(api.get(url, { signal }));
  },

  byId: (playerId: string, membershipId: string, signal?: AbortSignal) =>
    unwrap<PlayerMembership>(
      api.get(ENDPOINTS.playerMemberships.byId(playerId, membershipId), { signal }),
    ),

  // create: (playerId: string, dto: CreatePlayerMembershipDto, signal?: AbortSignal) =>
  //   unwrap<PlayerMembership>(
  //     api.post(ENDPOINTS.playerMemberships.create(playerId), dto, { signal }),
  //   ),
   create: (playerId: string, dto: CreatePlayerMembershipDto, signal?: AbortSignal) =>
    unwrap<PlayerMembership>(
      api.post(ENDPOINTS.playerMemberships.create(playerId), dto, { signal }),
    ),


  update: (
    playerId: string,
    membershipId: string,
    dto: UpdatePlayerMembershipDto,
    signal?: AbortSignal,
  ) =>
    unwrap<PlayerMembership>(
      api.put(ENDPOINTS.playerMemberships.update(playerId, membershipId), dto, { signal }),
    ),

  delete: (playerId: string, membershipId: string, signal?: AbortSignal) =>
    unwrap<void>(
      api.delete(ENDPOINTS.playerMemberships.delete(playerId, membershipId), { signal }),
    ),
} as const;
