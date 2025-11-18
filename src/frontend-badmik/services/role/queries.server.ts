// src/services/role/queries.server.ts
// import 'server-only';
// import { qk } from '../_shared/queryKeys';
// import { roleApiServer } from './api.server';

// export const roleServerQueries = {
//   list: () => ({
//     queryKey: qk.role.list(),
//     queryFn: () => roleApiServer.list(),
//   }),
// };


//==========================


import 'server-only';
import { qk } from '../_shared/queryKeys';
import { roleApiServer } from './api.server';

export const roleServerQueries = {
  // ролі клубу
  listByClub: (clubId: string) => ({
    queryKey: qk.role.listByClub(clubId),
    queryFn: () => roleApiServer.listByClub(clubId),
  }),

  // ролі конкретного співробітника
  listByStaff: (staffId: string, clubId: string) => ({
    queryKey: qk.role.listByStaff(staffId, clubId),
    queryFn: () => roleApiServer.listByStaff(staffId, clubId),
  }),
} as const;

