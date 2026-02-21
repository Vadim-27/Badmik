// src/services/clubMembershipPlans/queries.client.ts
'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { qk } from '@/services/_shared/queryKeys';
import { clubMembershipPlansApiClient } from './api.client';

import type {
  ClubMembershipPlan,
  CreateClubMembershipPlanDto,
  UpdateClubMembershipPlanDto,
} from '@/services/types/clubMembershipPlans.dto';

export function useClubMembershipPlansList(
  clubId: string,
  options?: Partial<UseQueryOptions<ClubMembershipPlan[], unknown, ClubMembershipPlan[], QueryKey>>,
) {
  return useQuery({
    queryKey: qk.clubMembershipPlans.list(clubId),
    queryFn: ({ signal }) => clubMembershipPlansApiClient.list(clubId, signal),
    enabled: Boolean(clubId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    ...(options ?? {}),
  });
}

type UseByIdOptions = Partial<UseQueryOptions<ClubMembershipPlan, unknown, ClubMembershipPlan, QueryKey>> & {
  initialData?: ClubMembershipPlan;
};

export function useClubMembershipPlanById(clubId: string, planId: string, options?: UseByIdOptions) {
  return useQuery({
    queryKey: qk.clubMembershipPlans.byId(clubId, planId),
    queryFn: ({ signal }) => clubMembershipPlansApiClient.byId(clubId, planId, signal),
    enabled: Boolean(clubId) && Boolean(planId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    ...(options ?? {}),
  });
}

export function useCreateClubMembershipPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['clubMembershipPlans', 'create'],
    mutationFn: ({ clubId, dto }: { clubId: string; dto: CreateClubMembershipPlanDto }) =>
      clubMembershipPlansApiClient.create(clubId, dto),
    onSuccess: (_res, { clubId }) => {
      qc.invalidateQueries({ queryKey: qk.clubMembershipPlans.list(clubId) });
    },
  });
}

export function useUpdateClubMembershipPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['clubMembershipPlans', 'update'],
    mutationFn: ({
      clubId,
      planId,
      dto,
    }: {
      clubId: string;
      planId: string;
      dto: UpdateClubMembershipPlanDto;
    }) => clubMembershipPlansApiClient.update(clubId, planId, dto),
    onSuccess: (_res, { clubId, planId }) => {
      qc.invalidateQueries({ queryKey: qk.clubMembershipPlans.list(clubId) });
      qc.invalidateQueries({ queryKey: qk.clubMembershipPlans.byId(clubId, planId) });
    },
  });
}

export function useDeleteClubMembershipPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['clubMembershipPlans', 'delete'],
    mutationFn: ({ clubId, planId }: { clubId: string; planId: string }) =>
      clubMembershipPlansApiClient.remove(clubId, planId),
    onSuccess: (_res, { clubId }) => {
      qc.invalidateQueries({ queryKey: qk.clubMembershipPlans.list(clubId) });
    },
  });
}
