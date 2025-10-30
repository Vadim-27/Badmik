// src/services/players/queries.server.ts
import 'server-only';
import { qk } from '../_shared/queryKeys';
import { playersApiServer } from './api.server';

export const playersServerQueries = {
  list: () => ({
    queryKey: qk.players.list(),
    queryFn: () => playersApiServer.list(),
  }),
  byId: (id: string) => ({
    queryKey: qk.players.byId(id),
    queryFn: () => playersApiServer.byId(id),
  }),
};
