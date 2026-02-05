// src/services/players/api.server.ts
import 'server-only';
import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';
import { withQuery } from '@/lib/http/qs';

type ListParams = { clubId?: string; page?: number; pageSize?: number };

export const playersApiServer = {
  async list(params: ListParams = {}) {
    const url = withQuery(ENDPOINTS.players.getAll, {
      ClubId: params.clubId,
      Page: params.page,
      PageSize: params.pageSize,
    });

    const res = await serverFetch(url, {}, { revalidate: 60, tags: ['players'] });
    return res.json();
  },

  async byId(id: string) {
    const res = await serverFetch(ENDPOINTS.players.getById(id), {}, { revalidate: 60, tags: ['players'] });
    return res.json();
  },
  
   async logo(id: string) {
    const res = await serverFetch(ENDPOINTS.players.logo(id), {}, { revalidate: 60, tags: ['players'] });
    return res.blob();
  },
};

