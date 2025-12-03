// src/services/clubs/queries.client.ts
'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
  type QueryKey,
} from '@tanstack/react-query';
import { qk } from '../_shared/queryKeys';
import { clubsApiClient } from './api.client';
import type { Club, CreateClubDto, UpdateClubDto } from '@/services/types/clubs.dto';

export function useClubsList(
  filter?: string,
  options?: Partial<UseQueryOptions<Club[], unknown, Club[], QueryKey>>,
) {
  return useQuery({
    queryKey: qk.clubs.list(filter),
    queryFn: ({ signal }) => clubsApiClient.list({ filter }, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
}

type UseClubByIdOptions = Partial<
  UseQueryOptions<Club, unknown, Club, QueryKey>
> & {
  initialData?: Club;
};

export function useClubById(id: string, options?: UseClubByIdOptions) {
  return useQuery({
    queryKey: qk.clubs.byId(id),
    queryFn: ({ signal }) => clubsApiClient.byId(id, signal),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...(options ?? {}),
  });
}

export function useCreateClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['clubs', 'create'],
    mutationFn: (dto: CreateClubDto) => clubsApiClient.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.clubs.list() });
    },
  });
}

export function useUpdateClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['clubs', 'update'],
    mutationFn: ({ id, dto }: { id: string; dto: UpdateClubDto }) =>
      clubsApiClient.update(id, dto),
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: qk.clubs.list() });
      qc.invalidateQueries({ queryKey: qk.clubs.byId(id) });
    },
  });
}

export function useDeleteClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['clubs', 'delete'],
    mutationFn: (id: string) => clubsApiClient.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.clubs.list() });
    },
  });
}

export function useActivateClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['clubs', 'activate'],
    mutationFn: (id: string) => clubsApiClient.activate(id),
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: qk.clubs.list() });
      qc.invalidateQueries({ queryKey: qk.clubs.byId(id as string) });
    },
  });
}

export function useDeactivateClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['clubs', 'deactivate'],
    mutationFn: (id: string) => clubsApiClient.deactivate(id),
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: qk.clubs.list() });
      qc.invalidateQueries({ queryKey: qk.clubs.byId(id as string) });
    },
  });
}

// export function useActivateClub() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationKey: ['clubs', 'activate'],
//     mutationFn: (id: string) => clubsApiClient.activate(id),
//     onSuccess: (_res, id) => {
//       qc.invalidateQueries({ queryKey: qk.clubs.list() });
//       qc.invalidateQueries({ queryKey: qk.clubs.byId(id) });
//     },
//   });
// }

// export function useDeactivateClub() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationKey: ['clubs', 'deactivate'],
//     mutationFn: (id: string) => clubsApiClient.deactivate(id),
//     onSuccess: (_res, id) => {
//       qc.invalidateQueries({ queryKey: qk.clubs.list() });
//       qc.invalidateQueries({ queryKey: qk.clubs.byId(id) });
//     },
//   });
// }
