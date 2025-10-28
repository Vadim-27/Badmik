// src/services/staff/queries.server.ts
import 'server-only';
import { qk } from '../_shared/queryKeys';
import { staffApiServer } from './api.server';

export const staffServerQueries = {
  list: () => ({
    queryKey: qk.staff.list(),
    queryFn: () => staffApiServer.list(),
  }),
  byId: (id: string) => ({
    queryKey: qk.staff.byId(id),
    queryFn: () => staffApiServer.byId(id),
  }),
};