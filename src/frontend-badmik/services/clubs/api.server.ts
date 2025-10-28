// src/services/clubs/api.server.ts
import 'server-only';
import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Club, CreateClubDto, UpdateClubDto } from '../types/clubs.dto';

export const clubsApiServer = {
  async list(): Promise<Club[]> {
    const res = await serverFetch(ENDPOINTS.clubs.getAll, {}, { revalidate: 60, tags: ['clubs'] });
    return res.json();
  },

  async create(dto: CreateClubDto): Promise<Club> {
    const res = await serverFetch(ENDPOINTS.clubs.create, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.json();
  },

  async update(id: string, dto: UpdateClubDto): Promise<Club> {
    const res = await serverFetch(ENDPOINTS.clubs.update(id), {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
    return res.json();
  },

  async remove(id: string): Promise<void> {
    await serverFetch(ENDPOINTS.clubs.delete(id), { method: 'DELETE' });
  },
} as const;
