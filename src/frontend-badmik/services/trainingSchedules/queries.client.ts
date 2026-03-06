// src/services/trainingSchedules/queries.client.ts
'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type QueryKey,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { qk } from '@/services/_shared/queryKeys';
import { trainingSchedulesApiClient } from './api.client';

import type {
  TrainingSchedule,
  CreateTrainingScheduleDto,
  UpdateTrainingScheduleDto,
  GenerateTrainingSchedulesDto,
  CreateTrainingSessionDto,
  TrainingSchedulesListParams,
  TrainingSchedulesListResponseDto
} from '@/services/types/trainingSchedules.dto';

type UseScheduleByIdOptions = Partial<
  UseQueryOptions<TrainingSchedule, unknown, TrainingSchedule, QueryKey>
> & { initialData?: TrainingSchedule };

export function useTrainingScheduleById(id: string, options?: UseScheduleByIdOptions) {
  return useQuery({
    queryKey: qk.trainingSchedules.byId(id),
    queryFn: ({ signal }) => trainingSchedulesApiClient.byId(id, signal),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...(options ?? {}),
  });
}

export function useTrainingSchedulesList(
  params?: TrainingSchedulesListParams,
  options?: Partial<
    UseQueryOptions<
      TrainingSchedulesListResponseDto,
      unknown,
      TrainingSchedulesListResponseDto,
      QueryKey
    >
  >,
) {
  return useQuery({
    queryKey: qk.trainingSchedules.list(params ?? {}),
    queryFn: ({ signal }) => trainingSchedulesApiClient.list(params ?? {}, signal),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
}

// ✅ залишаємо твій старий хук, але тепер він просто wrapper над list()
export function useActiveTrainingSchedulesByClub(
  clubId: string,
  options?: Partial<
    UseQueryOptions<
      TrainingSchedulesListResponseDto,
      unknown,
      TrainingSchedulesListResponseDto,
      QueryKey
    >
  >,
) {
  return useTrainingSchedulesList(
    { clubId, isActive: true },
    { enabled: !!clubId, ...(options ?? {}) },
  );
}

export function useCreateTrainingSchedule() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['trainingSchedules', 'create'],
    mutationFn: (dto: CreateTrainingScheduleDto) => trainingSchedulesApiClient.create(dto),
    onSuccess: (_id, dto) => {
      qc.invalidateQueries({ queryKey: qk.trainingSchedules.list({ clubId: dto.clubId, isActive: true }) });
      qc.invalidateQueries({ queryKey: qk.trainingSchedules.list({ clubId: dto.clubId }) });
    },
  });
}

export function useUpdateTrainingSchedule() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['trainingSchedules', 'update'],
    mutationFn: ({ scheduleId, dto }: { scheduleId: string; dto: UpdateTrainingScheduleDto }) =>
      trainingSchedulesApiClient.update(scheduleId, dto),
    onSuccess: (_res, { scheduleId, dto }) => {
      qc.invalidateQueries({ queryKey: qk.trainingSchedules.byId(scheduleId) });
      qc.invalidateQueries({ queryKey: qk.trainingSchedules.list({ clubId: dto.clubId, isActive: true }) });
      qc.invalidateQueries({ queryKey: qk.trainingSchedules.list({ clubId: dto.clubId }) });
    },
  });
}

export function useDeactivateTrainingSchedule() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['trainingSchedules', 'deactivate'],
    mutationFn: ({ scheduleId }: { scheduleId: string }) =>
      trainingSchedulesApiClient.deactivate(scheduleId),
    onSuccess: (_res, { scheduleId }) => {
      qc.invalidateQueries({ queryKey: qk.trainingSchedules.byId(scheduleId) });
      qc.invalidateQueries({ queryKey: qk.trainingSchedules.root() });
    },
  });
}

export function useGenerateTrainingSchedulesByClub() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['trainingSchedules', 'generateByClub'],
    mutationFn: ({ clubId, dto }: { clubId: string; dto: GenerateTrainingSchedulesDto }) =>
      trainingSchedulesApiClient.generateByClub(clubId, dto),
    onSuccess: (_res, { clubId }) => {
      qc.invalidateQueries({ queryKey: qk.trainingSchedules.list({ clubId, isActive: true }) });
      qc.invalidateQueries({ queryKey: qk.trainingSchedules.list({ clubId }) });
    },
  });
}

export function useCreateTrainingSessionFromSchedule() {
  return useMutation({
    mutationKey: ['trainingSchedules', 'createSession'],
    mutationFn: ({ scheduleId, dto }: { scheduleId: string; dto: CreateTrainingSessionDto }) =>
      trainingSchedulesApiClient.createSession(scheduleId, dto),
  });
}