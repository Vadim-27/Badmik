// src/services/clubs/queries.server.ts
import 'server-only';
import { qk } from '../_shared/queryKeys';
import { clubsApiServer } from './api.server';

export const clubsServerQueries = {
  list: (filter?: string) => ({
    queryKey: qk.clubs.list(filter),
    queryFn: () => clubsApiServer.list({ filter }),
  }),
  byId: (id: string) => ({
    queryKey: qk.clubs.byId(id),
    queryFn: () => clubsApiServer.byId(id),
  }),
};

 