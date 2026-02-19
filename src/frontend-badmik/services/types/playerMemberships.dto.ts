// src/services/types/playerMemberships.dto.ts
export type MembershipStatus = 'Active' | 'Pending' | 'Suspended' | 'Left' | string;


export type SportType =
  | 'Badminton'
  | 'Squash'
  | 'Padel'
  | 'Pickleball'
  | 'Tennis'
  | 'TableTennis'
  | string;

// ✅ ВАЖЛИВО: має відповідати Swagger enum
export type TrainingType =
  | 'Kids'
  | 'Individual'
  | 'Educational'
  | 'Group'
  | 'CourtRental'
  | string;

export type PlayerMembership = {
  id: string;
  clubId: string;
  status: MembershipStatus;

  validFrom: string;
  validUntil: string;

  sportType: SportType;
  trainingType: TrainingType;

  trainingsTotalGranted: number;
  trainingsLeft: number;
};

export type CreatePlayerMembershipDto = {
  clubId: string;
  validFrom: string;
  validUntil: string;
  sportType: SportType;
  trainingType: TrainingType;
  trainingsTotalGranted: number;
  planId: string;
};

export type UpdatePlayerMembershipDto = {
  status?: MembershipStatus;
  validFrom?: string;
  validUntil?: string;
  trainingsLeft?: number;
  trainingsTotalGranted?: number;
};

