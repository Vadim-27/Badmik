// src/services/clubs/queries.server.ts
import 'server-only';
import { qk } from '../_shared/queryKeys';
import { clubsApiServer } from './api.server';

export const clubsServerQueries = {
  list: () => ({
    queryKey: qk.clubs.list(),
    queryFn: () => clubsApiServer.list(),
  }),
};
 