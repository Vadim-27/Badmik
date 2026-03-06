export type TrainingScheduleLevel = {
  trainingScheduleId: string;
  trainingSchedule: string;
  level: string;
};

export type TrainingSchedule = {
  id: string;
  clubId: string;
  locationId: string;

  isActive: boolean;

  dayOfWeek: string;
  startTime: string;   
  endTime: string;     

  sport: string;       
  type: string;        

  levels: TrainingScheduleLevel[];

  courtsRequired: number;
  maxParticipants: number;

  createdAtUtc: string;
  updatedAtUtc: string;
};


export type CreateTrainingScheduleDto = {
  clubId: string;
  locationId: string;

  isActive: boolean;

  dayOfWeek: string;
  startTime: string;
  endTime: string;

  sport: string;
  type: string;

  courtsRequired: number;
  maxParticipants: number;

  levels: string[];
};

export type TrainingSchedulesListResponseDto = {
  list: TrainingSchedule[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type TrainingSchedulesListParams = {
  clubId?: string;
  locationId?: string;
  isActive?: boolean;
  dayOfWeek?: string;
  sport?: string;
  type?: string;
  level?: string;
  startFrom?: string;
  startTo?: string;
  date?: string;
  page?: number;
  pageSize?: number;
};

// export type UpdateTrainingScheduleDto = CreateTrainingScheduleDto;

export type UpdateTrainingScheduleDto = {
  clubId: string;
  locationId: string;

  isActive: boolean;

  dayOfWeek: string;
  startTime: string;
  endTime: string;

  sport: string;
  type: string;

  courtsRequired: number;
  maxParticipants: number;

  levels: string[];
};
export type GenerateTrainingSchedulesDto = {
  fromDate: string;
  toDate: string;
  createdByUserId: string;
};

export type CreateTrainingSessionDto = {
  scheduleId: string;
  date: string;
  trainerId: string;
  overrideCourtsUsed: number;
  overrideMaxPlayers: number;
};