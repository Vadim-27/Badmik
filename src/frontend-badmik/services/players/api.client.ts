// src/services/players/api.client.ts
import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';
import type { Player, CreatePlayerDto, UpdatePlayerDto } from '../types/players.dto';

export const playersApiClient = {
  list: (signal?: AbortSignal) =>
    unwrap<Player[]>(api.get(ENDPOINTS.player.getAll, { signal })),

  byId: (id: string, signal?: AbortSignal) =>
    unwrap<Player>(api.get(ENDPOINTS.player.getById(id), { signal })),

  register: (dto: CreatePlayerDto, signal?: AbortSignal) =>
    unwrap<Player>(api.post(ENDPOINTS.player.register, dto, { signal })),

  update: (id: string, dto: UpdatePlayerDto, signal?: AbortSignal) =>
    unwrap<Player>(api.put(ENDPOINTS.player.update(id), dto, { signal })),
} as const;
