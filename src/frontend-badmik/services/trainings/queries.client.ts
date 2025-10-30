// src/services/trainings/queries.client.ts
'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { qk } from '../_shared/queryKeys';
import { trainingsApiClient } from './api.client';
import type {
  Training, CreateTrainingDto, UpdateTrainingDto,
  TrainingParticipant, QueueEntry
} from '../types/training.dto';
import type { UseQueryOptions, QueryKey } from '@tanstack/react-query';

export function useTrainingsList(
  options?: Partial<UseQueryOptions<Training[], unknown, Training[], QueryKey>>
) {
  return useQuery({
    queryKey: qk.trainings.list(),
    queryFn: ({ signal }) => trainingsApiClient.list(signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
}

export function useTrainingById(
  id: string,
  options?: Partial<UseQueryOptions<Training, unknown, Training, QueryKey>>
) {
  return useQuery({
    queryKey: qk.trainings.byId(id),
    queryFn: ({ signal }) => trainingsApiClient.byId(id, signal),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...(options ?? {}),
  });
}

export function useTrainingParticipants(
  id: string,
  options?: Partial<UseQueryOptions<TrainingParticipant[], unknown, TrainingParticipant[], QueryKey>>
) {
  return useQuery({
    queryKey: qk.trainings.participants(id),
    queryFn: ({ signal }) => trainingsApiClient.getParticipants(id, signal),
    enabled: !!id,
    staleTime: 30 * 1000,
    ...(options ?? {}),
  });
}

export function useTrainingQueue(
  id: string,
  options?: Partial<UseQueryOptions<QueueEntry[], unknown, QueueEntry[], QueryKey>>
) {
  return useQuery({
    queryKey: qk.trainings.queue(id),
    queryFn: ({ signal }) => trainingsApiClient.getQueue(id, signal),
    enabled: !!id,
    staleTime: 30 * 1000,
    ...(options ?? {}),
  });
}

// ===== Mutations =====

export function useCreateTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['trainings', 'create'],
    mutationFn: (dto: CreateTrainingDto) => trainingsApiClient.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.trainings.list() }),
  });
}

export function useUpdateTraining(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['trainings', 'update', id],
    mutationFn: (dto: UpdateTrainingDto) => trainingsApiClient.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.trainings.list() });
      qc.invalidateQueries({ queryKey: qk.trainings.byId(id) });
    },
  });
}

export function useDeleteTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['trainings', 'delete'],
    mutationFn: (id: string) => trainingsApiClient.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.trainings.list() }),
  });
}

export function useCancelTraining(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['trainings', 'cancel', id],
    mutationFn: () => trainingsApiClient.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.trainings.list() });
      qc.invalidateQueries({ queryKey: qk.trainings.byId(id) });
    },
  });
}

export function useJoinTrainingQueue(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['trainings', 'joinQueue', id],
    mutationFn: () => trainingsApiClient.joinQueue(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.trainings.queue(id) });
      qc.invalidateQueries({ queryKey: qk.trainings.byId(id) });
    },
  });
}

export function useLeaveTrainingQueue(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['trainings', 'leaveQueue', id],
    mutationFn: () => trainingsApiClient.leaveQueue(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.trainings.queue(id) });
      qc.invalidateQueries({ queryKey: qk.trainings.byId(id) });
    },
  });
}
