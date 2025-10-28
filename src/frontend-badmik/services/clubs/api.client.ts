// src/services/clubs/api.client.ts
import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';
import type { Club, CreateClubDto, UpdateClubDto } from '../types/clubs.dto';

export const clubsApiClient = {
  list: (signal?: AbortSignal) =>
    unwrap<Club[]>(api.get(ENDPOINTS.clubs.getAll, { signal })),

  create: (dto: CreateClubDto, signal?: AbortSignal) =>
    unwrap<Club>(api.post(ENDPOINTS.clubs.create, dto, { signal })),

  update: (id: string, dto: UpdateClubDto, signal?: AbortSignal) =>
    unwrap<Club>(api.put(ENDPOINTS.clubs.update(id), dto, { signal })),

  remove: (id: string, signal?: AbortSignal) =>
    unwrap<void>(api.delete(ENDPOINTS.clubs.delete(id), { signal })),
} as const;
