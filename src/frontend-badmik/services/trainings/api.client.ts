// src/services/trainings/api.client.ts
import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';
import type {
  Training, CreateTrainingDto, UpdateTrainingDto,
  TrainingParticipant, QueueEntry
} from '../types/training.dto';

export const trainingsApiClient = {
  list: (signal?: AbortSignal) =>
    unwrap<Training[]>(api.get(ENDPOINTS.trainings.getAll, { signal })),

  byId: (id: string, signal?: AbortSignal) =>
    unwrap<Training>(api.get(ENDPOINTS.trainings.getById(id), { signal })),

  create: (dto: CreateTrainingDto, signal?: AbortSignal) =>
    unwrap<Training>(api.post(ENDPOINTS.trainings.create, dto, { signal })),

  update: (id: string, dto: UpdateTrainingDto, signal?: AbortSignal) =>
    unwrap<Training>(api.put(ENDPOINTS.trainings.update(id), dto, { signal })),

  remove: (id: string, signal?: AbortSignal) =>
    unwrap<void>(api.delete(ENDPOINTS.trainings.delete(id), { signal })),

  cancel: (id: string, signal?: AbortSignal) =>
    unwrap<void>(api.post(ENDPOINTS.trainings.cancel(id), null, { signal })),

  joinQueue: (id: string, signal?: AbortSignal) =>
    unwrap<void>(api.post(ENDPOINTS.trainings.joinQueue(id), null, { signal })),

  leaveQueue: (id: string, signal?: AbortSignal) =>
    unwrap<void>(api.delete(ENDPOINTS.trainings.leaveQueue(id), { signal })),

  getParticipants: (id: string, signal?: AbortSignal) =>
    unwrap<TrainingParticipant[]>(api.get(ENDPOINTS.trainings.getParticipants(id), { signal })),

  getQueue: (id: string, signal?: AbortSignal) =>
    unwrap<QueueEntry[]>(api.get(ENDPOINTS.trainings.getQueue(id), { signal })),
} as const;
