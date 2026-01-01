// src/services/locations/queries.server.ts
import 'server-only';
import { qk } from '@/services/_shared/queryKeys';
import { locationsApiServer } from './api.server';

export const locationsServerQueries = {
  list: (clubId?: string) => ({
    queryKey: qk.locations.list(clubId),
    queryFn: () => locationsApiServer.list({ clubId }),
  }),

   listByClub: (clubId: string) => ({
    queryKey: qk.locations.list(clubId), // з clubId
    queryFn: () => locationsApiServer.listByClub(clubId),
  }),
  
  byId: (id: string) => ({
    queryKey: qk.locations.byId(id),
    queryFn: () => locationsApiServer.byId(id),
  }),
};
               