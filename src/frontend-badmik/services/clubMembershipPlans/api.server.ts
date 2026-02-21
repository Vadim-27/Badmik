// src/services/clubMembershipPlans/api.server.ts
import 'server-only';
import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';

import type {
  ClubMembershipPlan,
  CreateClubMembershipPlanDto,
  UpdateClubMembershipPlanDto,
} from '@/services/types/clubMembershipPlans.dto';

export const clubMembershipPlansApiServer = {
  async list(clubId: string): Promise<ClubMembershipPlan[]> {
    const res = await serverFetch(
      ENDPOINTS.clubMembershipPlans.list(clubId),
      {},
      { revalidate: 60, tags: [`clubMembershipPlans:${clubId}`] },
    );
    return res.json();
  },

  async byId(clubId: string, planId: string): Promise<ClubMembershipPlan> {
    const res = await serverFetch(
      ENDPOINTS.clubMembershipPlans.byId(clubId, planId),
      {},
      { revalidate: 60, tags: [`clubMembershipPlans:${clubId}`, `clubMembershipPlan:${planId}`] },
    );
    return res.json();
  },

  async create(clubId: string, dto: CreateClubMembershipPlanDto): Promise<ClubMembershipPlan> {
    const res = await serverFetch(ENDPOINTS.clubMembershipPlans.create(clubId), {
      method: 'POST',
      body: JSON.stringify(dto),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  async update(clubId: string, planId: string, dto: UpdateClubMembershipPlanDto): Promise<ClubMembershipPlan> {
    const res = await serverFetch(ENDPOINTS.clubMembershipPlans.update(clubId, planId), {
      method: 'PUT',
      body: JSON.stringify(dto),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  async remove(clubId: string, planId: string): Promise<void> {
    await serverFetch(ENDPOINTS.clubMembershipPlans.delete(clubId, planId), {
      method: 'DELETE',
    });
  },
} as const;
