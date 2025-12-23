// src/services/locations/api.server.ts
import 'server-only';
import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Location } from '@/services/types/locations.dto';

type ListParams = { clubId?: string };

export const locationsApiServer = {
  async list(params: ListParams = {}): Promise<Location[]> {
    const url = params.clubId
      ? ENDPOINTS.locations.byClub(params.clubId)
      : ENDPOINTS.locations.getAll;

    const res = await serverFetch(url, {}, {
      revalidate: 60,
      tags: ['locations'],
    });

    return res.json();
  },

  async byId(id: string): Promise<Location> {
    const res = await serverFetch(
      ENDPOINTS.locations.getById(id),
      {},
      { revalidate: 60, tags: [`location:${id}`] },
    );
    return res.json();
  },
} as const;
