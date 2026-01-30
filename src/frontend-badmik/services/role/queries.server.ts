// src/services/role/queries.server.ts
import 'server-only';
import { qk } from '../_shared/queryKeys';
import { roleApiServer } from './api.server';

export const roleServerQueries = {
  listByClub: (clubId: string) => ({
    queryKey: qk.role.listByClub(clubId),
    queryFn: () => roleApiServer.listByClub(clubId),
  }),

  listByStaff: (staffId: string) => ({
    queryKey: qk.role.listByStaff(staffId),
    queryFn: () => roleApiServer.listByStaff(staffId),
  }),
} as const;


