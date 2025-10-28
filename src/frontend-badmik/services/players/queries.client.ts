// src/services/players/queries.client.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { qk } from '../_shared/queryKeys';
import { playersApiClient } from './api.client';
import type { Player, CreatePlayerDto, UpdatePlayerDto } from '../types/players.dto';
import type { UseQueryOptions, QueryKey } from '@tanstack/react-query';

export function usePlayersList(
  options?: Partial<UseQueryOptions<Player[], unknown, Player[], QueryKey>>
) {
  return useQuery({
    queryKey: qk.players.list(),
    queryFn: ({ signal }) => playersApiClient.list(signal),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
}

export function usePlayerById(
  id: string,
  options?: Partial<UseQueryOptions<Player, unknown, Player, QueryKey>>
) {
  return useQuery({
    queryKey: qk.players.byId(id),
    queryFn: ({ signal }) => playersApiClient.byId(id, signal),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...(options ?? {}),
  });
}

export function useRegisterPlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['players', 'register'],
    mutationFn: (dto: CreatePlayerDto) => playersApiClient.register(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.players.list() }),
  });
}

export function useUpdatePlayer(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['players', 'update', id],
    mutationFn: (dto: UpdatePlayerDto) => playersApiClient.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.players.list() });
      qc.invalidateQueries({ queryKey: qk.players.byId(id) });
    },
  });
}
