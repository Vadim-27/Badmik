// src/services/players/queries.server.ts
import 'server-only';
import { qk } from '@/services/_shared/queryKeys';
import { playersApiServer } from './api.server';

type ListParams = { clubId?: string; page?: number; pageSize?: number };

export const playersServerQueries = {
  list: (params: ListParams = {}) => ({
    queryKey: qk.players.list(params),
    queryFn: () => playersApiServer.list(params),
  }),
    byId: (id: string) => ({
    queryKey: qk.players.byId(id),
    queryFn: () => playersApiServer.byId(id),
  }),
    logo: (id: string) => ({
    queryKey: qk.players.logo(id),
    queryFn: () => playersApiServer.logo(id),
  }),
};

