

// src/services/playerMemberships/queries.client.ts
'use client';

import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
  useQueryClient,
} from '@tanstack/react-query';

import { qk } from '@/services/_shared/queryKeys';
import { playerMembershipsApiClient } from './api.client';

import type {
  PlayerMembership,
  CreatePlayerMembershipDto,
  UpdatePlayerMembershipDto,
} from '@/services/types/playerMemberships.dto';

export type PlayerMembershipsListParams = {
  playerId: string;
  clubId?: string;
};

export function usePlayerMembershipsList(
  params: PlayerMembershipsListParams,
  options?: Partial<UseQueryOptions<PlayerMembership[], unknown, PlayerMembership[], QueryKey>>,
) {
  return useQuery({
    queryKey: qk.playerMemberships.list(params),
    queryFn: ({ signal }) => playerMembershipsApiClient.list(params, signal),
    enabled: Boolean(params?.playerId),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
    ...(options ?? {}),
  });
}

export function usePlayerMembershipById(
  playerId: string,
  membershipId: string,
  options?: Partial<UseQueryOptions<PlayerMembership, unknown, PlayerMembership, QueryKey>>,
) {
  return useQuery({
    queryKey: qk.playerMemberships.byId(playerId, membershipId),
    queryFn: ({ signal }) => playerMembershipsApiClient.byId(playerId, membershipId, signal),
    enabled: Boolean(playerId) && Boolean(membershipId),
    ...(options ?? {}),
  });
}

export function useCreatePlayerMembership(
  options?: UseMutationOptions<
    PlayerMembership,
    unknown,
    { playerId: string; clubId?: string; dto: CreatePlayerMembershipDto }
  >,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['playerMemberships', 'create'],
    mutationFn: ({ playerId, dto }) => playerMembershipsApiClient.create(playerId, dto),

    ...(options ?? {}),

    onSuccess: async (data, vars, onMutateResult, context) => {
      // ✅ інвалідейтимо ТІ САМІ ключі що і usePlayerMembershipsList
      await qc.invalidateQueries({
        queryKey: qk.playerMemberships.list({ playerId: vars.playerId, clubId: vars.clubId }),
      });

      await options?.onSuccess?.(data, vars, onMutateResult, context);
    },
  });
}

export function useUpdatePlayerMembership(
  options?: UseMutationOptions<
    PlayerMembership,
    unknown,
    { playerId: string; clubId?: string; membershipId: string; dto: UpdatePlayerMembershipDto }
  >,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['playerMemberships', 'update'],
    mutationFn: ({ playerId, membershipId, dto }) =>
      playerMembershipsApiClient.update(playerId, membershipId, dto),

    ...(options ?? {}),

    onSuccess: async (data, vars, onMutateResult, context) => {
      await qc.invalidateQueries({
        queryKey: qk.playerMemberships.byId(vars.playerId, vars.membershipId),
      });

      await qc.invalidateQueries({
        queryKey: qk.playerMemberships.list({ playerId: vars.playerId, clubId: vars.clubId }),
      });

      await options?.onSuccess?.(data, vars, onMutateResult, context);
    },
  });
}

export function useDeletePlayerMembership(
  options?: UseMutationOptions<void, unknown, { playerId: string; clubId?: string; membershipId: string }>,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['playerMemberships', 'delete'],
    mutationFn: ({ playerId, membershipId }) => playerMembershipsApiClient.delete(playerId, membershipId),

    ...(options ?? {}),

    onSuccess: async (data, vars, onMutateResult, context) => {
      await qc.invalidateQueries({
        queryKey: qk.playerMemberships.list({ playerId: vars.playerId, clubId: vars.clubId }),
      });

      await options?.onSuccess?.(data, vars, onMutateResult, context);
    },
  });
}

