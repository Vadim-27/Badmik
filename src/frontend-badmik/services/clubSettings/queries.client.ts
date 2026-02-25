'use client';

import { useQuery, useMutation, useQueryClient, type QueryKey, type UseQueryOptions } from '@tanstack/react-query';
import { qk } from '@/services/_shared/queryKeys';
import { clubSettingsApiClient } from './api.client';
import type { ClubSettings, UpdateClubSettingsDto } from '@/services/types/clubSettings.dto';

type UseClubSettingsOptions = Partial<
  UseQueryOptions<ClubSettings, unknown, ClubSettings, QueryKey>
>;

export function useClubSettingsByClubId(clubId: string, options?: UseClubSettingsOptions) {
  return useQuery({
    queryKey: qk.clubSettings.byClubId(clubId),
    queryFn: ({ signal }) => clubSettingsApiClient.byClubId(clubId, signal),
    enabled: !!clubId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
}

export function useUpdateClubSettings(clubId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['clubSettings', 'update', clubId],
    mutationFn: (dto: UpdateClubSettingsDto) => clubSettingsApiClient.update(clubId, dto),

    onSuccess: (updated) => {
      
      qc.setQueryData(qk.clubSettings.byClubId(clubId), updated);

      
    },
  });
}

