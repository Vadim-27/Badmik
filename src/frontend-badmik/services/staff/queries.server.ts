// src/services/staff/queries.server.ts
import 'server-only';
import { qk } from '../_shared/queryKeys';
import { staffApiServer } from './api.server';

type ListParams = {
  clubId?: string;
  page?: number;
  pageSize?: number;
};

export const staffServerQueries = {
    list: (params: ListParams = {}) => ({
    queryKey: qk.staff.list(params),
    queryFn: () => staffApiServer.list(params),
  }),
  // list: () => ({
  //   queryKey: qk.staff.list(),
  //   queryFn: () => staffApiServer.list(),
  // }),
  byId: (id: string) => ({
    queryKey: qk.staff.byId(id),
    queryFn: () => staffApiServer.byId(id),
  }),

  byUserId: (userId: string) => ({
  queryKey: qk.staff.byUserId(userId),
  queryFn: () => staffApiServer.byUserId(userId),
}),

};


