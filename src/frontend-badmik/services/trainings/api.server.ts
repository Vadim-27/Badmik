// src/services/trainings/api.server.ts
import 'server-only';
import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';
import type {
  Training, CreateTrainingDto, UpdateTrainingDto,
  TrainingParticipant, QueueEntry
} from '../types/training.dto';

export const trainingsApiServer = {
  async list(): Promise<Training[]> {
    const res = await serverFetch(ENDPOINTS.trainings.getAll, {}, { revalidate: 60, tags: ['trainings'] });
    return res.json();
  },

  async byId(id: string): Promise<Training> {
    const res = await serverFetch(ENDPOINTS.trainings.getById(id), {}, { revalidate: 60, tags: [`trainings:${id}`] });
    return res.json();
  },

  async create(dto: CreateTrainingDto): Promise<Training> {
    const res = await serverFetch(ENDPOINTS.trainings.create, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.json();
  },

  async update(id: string, dto: UpdateTrainingDto): Promise<Training> {
    const res = await serverFetch(ENDPOINTS.trainings.update(id), {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
    return res.json();
  },

  async remove(id: string): Promise<void> {
    await serverFetch(ENDPOINTS.trainings.delete(id), { method: 'DELETE' });
  },

  async cancel(id: string): Promise<void> {
    await serverFetch(ENDPOINTS.trainings.cancel(id), { method: 'POST' });
  },

  async joinQueue(id: string): Promise<void> {
    await serverFetch(ENDPOINTS.trainings.joinQueue(id), { method: 'POST' });
  },

  async leaveQueue(id: string): Promise<void> {
    await serverFetch(ENDPOINTS.trainings.leaveQueue(id), { method: 'DELETE' });
  },

  async getParticipants(id: string): Promise<TrainingParticipant[]> {
    const res = await serverFetch(ENDPOINTS.trainings.getParticipants(id), {}, { revalidate: 30, tags: [`trainings:${id}:participants`] });
    return res.json();
  },

  async getQueue(id: string): Promise<QueueEntry[]> {
    const res = await serverFetch(ENDPOINTS.trainings.getQueue(id), {}, { revalidate: 30, tags: [`trainings:${id}:queue`] });
    return res.json();
  },
} as const;
