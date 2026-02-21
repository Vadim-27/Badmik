// src/services/clubMembershipPlans/queries.server.ts
import 'server-only';

import { qk } from '@/services/_shared/queryKeys';
import { clubMembershipPlansApiServer } from './api.server';

export const clubMembershipPlansServerQueries = {
  list: (clubId: string) => ({
    queryKey: qk.clubMembershipPlans.list(clubId),
    queryFn: () => clubMembershipPlansApiServer.list(clubId),
  }),
  byId: (clubId: string, planId: string) => ({
    queryKey: qk.clubMembershipPlans.byId(clubId, planId),
    queryFn: () => clubMembershipPlansApiServer.byId(clubId, planId),
  }),
};
