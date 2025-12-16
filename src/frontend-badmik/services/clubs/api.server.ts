// src/services/clubs/api.server.ts
import 'server-only';
import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';
import { withQuery } from '@/lib/http/qs';
import type { Club } from '@/services/types/clubs.dto';

type ListParams = { filter?: string };

export const clubsApiServer = {
  async list(params: ListParams = {}): Promise<Club[]> {
    const url = withQuery(ENDPOINTS.clubs.getAll, {
      filter: params.filter,
    });

    const res = await serverFetch(url, {}, { revalidate: 60, tags: ['clubs'] });
    return res.json();
  },

  async byId(id: string): Promise<Club> {
    const res = await serverFetch(
      ENDPOINTS.clubs.getById(id),
      {},
      { revalidate: 60, tags: [`club:${id}`] },
    );
    return res.json();
  },
} as const;

