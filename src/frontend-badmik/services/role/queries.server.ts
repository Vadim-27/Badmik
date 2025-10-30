// src/services/role/queries.server.ts
import 'server-only';
import { qk } from '../_shared/queryKeys';
import { roleApiServer } from './api.server';

export const roleServerQueries = {
  list: () => ({
    queryKey: qk.role.list(),
    queryFn: () => roleApiServer.list(),
  }),
};
