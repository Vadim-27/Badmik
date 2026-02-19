// src/services/types/clubMembershipPlans.dto.ts
import type { SportType, TrainingType } from './playerMemberships.dto';

export type ClubMembershipPlan = {
  id: string;
  clubId: string;

  name: string;
  durationDays: number;
  trainingsGranted: number;

  sportType: SportType;
  trainingType: TrainingType;

  isActive: boolean;

  createdAtUtc: string;
  updatedAtUtc: string;
};

export type CreateClubMembershipPlanDto = {
  clubId: string;
  name: string;
  durationDays: number;
  trainingsGranted: number;
  sportType: SportType;
  trainingType: TrainingType;
  isActive: boolean;
};

export type UpdateClubMembershipPlanDto = {
  name: string;
  durationDays: number;
  trainingsGranted: number;
  sportType: SportType;
  trainingType: TrainingType;
  isActive: boolean;
};
