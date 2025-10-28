// src/services/clubs/queries.client.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { qk } from '../_shared/queryKeys';
import { clubsApiClient } from './api.client';
import type { CreateClubDto, UpdateClubDto } from '../types/clubs.dto';

export function useClubsList() {
  return useQuery({
    queryKey: qk.clubs.list(),
    queryFn: ({ signal }) => clubsApiClient.list(signal),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['clubs', 'create'],
    mutationFn: (dto: CreateClubDto) => clubsApiClient.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.clubs.list() }),
  });
}

export function useUpdateClub(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['clubs', 'update', id],
    mutationFn: (dto: UpdateClubDto) => clubsApiClient.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.clubs.list() }),
  });
}

export function useDeleteClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['clubs', 'delete'],
    mutationFn: (id: string) => clubsApiClient.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.clubs.list() }),
  });
}
