// src/services/types/training.dto.ts
export type UUID = string;

export interface Training {
  id: UUID;
  title?: string;
  startsAt?: string; // ISO
  endsAt?: string;   // ISO
  clubId?: UUID;
  coachId?: UUID;
  status?: 'Scheduled' | 'Cancelled' | string;
  // додай поля з бекенду за потреби
}

export interface CreateTrainingDto {
  title: string;
  startsAt: string; // ISO
  endsAt: string;   // ISO
  clubId?: UUID;
  coachId?: UUID;
  // ...
}

export interface UpdateTrainingDto {
  title?: string;
  startsAt?: string;
  endsAt?: string;
  clubId?: UUID;
  coachId?: UUID;
  status?: string;
  // ...
}

export interface TrainingParticipant {
  id: UUID;         // userId/playerId
  firstName?: string;
  lastName?: string;
  // ...
}

export interface QueueEntry {
  id: UUID;         // userId/playerId
  joinedAt?: string;
}
