'use client';

import {
  useQuery,
  useMutation,
  keepPreviousData,
  type UseQueryOptions,
  type QueryKey,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { qk } from '@/services/_shared/queryKeys';
import { playersApiClient} from './api.client';
import type { CreatePlayerDto, Player, UpdatePlayerDto, PlayerPhoto } from '@/services/types/players.dto';

export type PlayersListParams = {
  clubId?: string;
  page?: number;
  pageSize?: number;
};

export function usePlayersList(
  params: PlayersListParams = {},
  options?: Partial<UseQueryOptions<any, unknown, any, QueryKey>>,
) {
  return useQuery({
    queryKey: qk.players.list(params),
    queryFn: ({ signal }) => playersApiClient.list(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
}

export function usePlayerById(
  id: string,
  options?: Partial<UseQueryOptions<Player, unknown, Player, QueryKey>>,
) {
  return useQuery({
    queryKey: qk.players.byId(id),
    queryFn: ({ signal }) => playersApiClient.byId(id, signal),
    enabled: Boolean(id),
    ...(options ?? {}),
  });
}

export function useCreatePlayer(
  options?: UseMutationOptions<Player, unknown, CreatePlayerDto>,
) {
  return useMutation({
    mutationKey: qk.players.create?.() ?? ['players', 'create'],
    mutationFn: (dto) => playersApiClient.create(dto),
    ...(options ?? {}),
  });
}


export function useUpdatePlayer(
  options?: UseMutationOptions<Player, unknown, { id: string; dto: UpdatePlayerDto }>,
) {
  return useMutation({
    mutationKey: qk.players.update(''), // ключ для мутації все одно буде в mutationFn по id, це просто форма
    mutationFn: ({ id, dto }) => playersApiClient.update(id, dto),
    ...(options ?? {}),
  });
}

// ✅ NEW: upload player photo
export function useUploadPlayerPhoto(
  options?: UseMutationOptions<PlayerPhoto, unknown, { id: string; file: File }>,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['players', 'uploadPhoto'],
    mutationFn: ({ id, file }) => playersApiClient.uploadPhoto(id, file),
    onSuccess: async (data, vars, onMutateResult, context) => {
      await qc.invalidateQueries({ queryKey: qk.players.byId(vars.id) });
      await qc.invalidateQueries({ queryKey: qk.players.logo(vars.id) });
      await qc.invalidateQueries({ queryKey: qk.players.photo(vars.id) });

      options?.onSuccess?.(data, vars, onMutateResult, context);
    },
    ...options,
  });
}

// ✅ NEW: delete player photo
export function useDeletePlayerPhoto(
  options?: UseMutationOptions<void, unknown, { id: string }>,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['players', 'deletePhoto'],
    mutationFn: ({ id }) => playersApiClient.deletePhoto(id),
    onSuccess: async (data, vars, onMutateResult, context) => {
      await qc.invalidateQueries({ queryKey: qk.players.byId(vars.id) });
      await qc.invalidateQueries({ queryKey: qk.players.logo(vars.id) });
      await qc.invalidateQueries({ queryKey: qk.players.photo(vars.id) });

      options?.onSuccess?.(data, vars, onMutateResult, context);
    },
    ...options,
  });
}


// ✅ NEW: get logo (Blob)
export function usePlayerLogo(
  id: string,
  options?: Partial<UseQueryOptions<Blob, unknown, Blob, QueryKey>>,
) {
  return useQuery({
    queryKey: qk.players.logo(id),
    queryFn: ({ signal }) => playersApiClient.logo(id, signal),
    enabled: Boolean(id),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
}
