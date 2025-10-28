// src/services/players/api.server.ts
import 'server-only';
import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Player, CreatePlayerDto, UpdatePlayerDto } from '../types/players.dto';

export const playersApiServer = {
  async list(): Promise<Player[]> {
    const res = await serverFetch(ENDPOINTS.player.getAll, {}, { revalidate: 60, tags: ['players'] });
    return res.json();
  },

  async byId(id: string): Promise<Player> {
    const res = await serverFetch(ENDPOINTS.player.getById(id), {}, { revalidate: 60, tags: [`players:${id}`] });
    return res.json();
  },

  async register(dto: CreatePlayerDto): Promise<Player> {
    const res = await serverFetch(ENDPOINTS.player.register, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.json();
  },

  async update(id: string, dto: UpdatePlayerDto): Promise<Player> {
    const res = await serverFetch(ENDPOINTS.player.update(id), {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
    return res.json();
  },
} as const;
