// src/services/locations/queries.client.ts
'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
  type QueryKey,
} from '@tanstack/react-query';
import { qk } from '@/services/_shared/queryKeys';
import { locationsApiClient } from './api.client';
import type {
  Location,
  CreateLocationDto,
  UpdateLocationDto,
} from '@/services/types/locations.dto';

export function useLocationsList(
  clubId?: string,
  options?: Partial<UseQueryOptions<Location[], unknown, Location[], QueryKey>>,
) {
  return useQuery({
    queryKey: qk.locations.list(clubId),
    queryFn: ({ signal }) => locationsApiClient.list({ clubId }, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
}

type UseLocationByIdOptions = Partial<
  UseQueryOptions<Location, unknown, Location, QueryKey>
> & {
  initialData?: Location;
};

export function useLocationsListByClub(
  clubId: string,
  options?: Partial<UseQueryOptions<Location[], unknown, Location[], QueryKey>>,
) {
  return useQuery({
    queryKey: qk.locations.list(clubId),
    queryFn: ({ signal }) => locationsApiClient.listByClub(clubId, signal),
    enabled: !!clubId,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
}

export function useLocationById(id: string, options?: UseLocationByIdOptions) {
  return useQuery({
    queryKey: qk.locations.byId(id),
    queryFn: ({ signal }) => locationsApiClient.byId(id, signal),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...(options ?? {}),
  });
}

export function useCreateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['locations', 'create'],
    mutationFn: (dto: CreateLocationDto) => locationsApiClient.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.locations.list() });
    },
  });
}

export function useUpdateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['locations', 'update'],
    mutationFn: ({ id, dto }: { id: string; dto: UpdateLocationDto }) =>
      locationsApiClient.update(id, dto),
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: qk.locations.list() });
      qc.invalidateQueries({ queryKey: qk.locations.byId(id) });
    },
  });
}

export function useDeleteLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['locations', 'delete'],
    mutationFn: (id: string) => locationsApiClient.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.locations.list() });
    },
  });
}
