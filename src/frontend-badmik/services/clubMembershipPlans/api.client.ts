// src/services/clubMembershipPlans/api.client.ts
import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';

import type {
  ClubMembershipPlan,
  CreateClubMembershipPlanDto,
  UpdateClubMembershipPlanDto,
} from '@/services/types/clubMembershipPlans.dto';

export const clubMembershipPlansApiClient = {
  list: (clubId: string, signal?: AbortSignal) =>
    unwrap<ClubMembershipPlan[]>(
      api.get(ENDPOINTS.clubMembershipPlans.list(clubId), { signal }),
    ),

  byId: (clubId: string, planId: string, signal?: AbortSignal) =>
    unwrap<ClubMembershipPlan>(
      api.get(ENDPOINTS.clubMembershipPlans.byId(clubId, planId), { signal }),
    ),

  create: (clubId: string, dto: CreateClubMembershipPlanDto, signal?: AbortSignal) =>
    unwrap<ClubMembershipPlan>(
      api.post(ENDPOINTS.clubMembershipPlans.create(clubId), dto, { signal }),
    ),

  update: (clubId: string, planId: string, dto: UpdateClubMembershipPlanDto, signal?: AbortSignal) =>
    unwrap<ClubMembershipPlan>(
      api.put(ENDPOINTS.clubMembershipPlans.update(clubId, planId), dto, { signal }),
    ),

  remove: (clubId: string, planId: string, signal?: AbortSignal) =>
    unwrap<void>(
      api.delete(ENDPOINTS.clubMembershipPlans.delete(clubId, planId), { signal }),
    ),
} as const;
