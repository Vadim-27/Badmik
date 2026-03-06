// src/services/trainingSchedules/api.client.ts
import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';

import { withQuery } from '@/lib/http/qs';

// import type {
//   TrainingSchedulesListParams,
//   TrainingSchedulesListResponseDto,
// } from '@/services/types/trainingSchedules.dto';

import type {
  TrainingSchedule,
  CreateTrainingScheduleDto,
  UpdateTrainingScheduleDto,
  GenerateTrainingSchedulesDto,
  CreateTrainingSessionDto,
  TrainingSchedulesListParams,
  TrainingSchedulesListResponseDto
} from '@/services/types/trainingSchedules.dto';

export const trainingSchedulesApiClient = {
   list: (params: TrainingSchedulesListParams = {}, signal?: AbortSignal) =>
    unwrap<TrainingSchedulesListResponseDto>(
      api.get(withQuery(ENDPOINTS.trainingSchedules.list, params), { signal }),
    ),

  byId: (id: string, signal?: AbortSignal) =>
    unwrap<TrainingSchedule>(api.get(ENDPOINTS.trainingSchedules.byId(id), { signal })),

  create: (dto: CreateTrainingScheduleDto, signal?: AbortSignal) =>
    unwrap<string>(api.post(ENDPOINTS.trainingSchedules.create, dto, { signal })),

  update: (scheduleId: string, dto: UpdateTrainingScheduleDto, signal?: AbortSignal) =>
    unwrap<void>(api.put(ENDPOINTS.trainingSchedules.update(scheduleId), dto, { signal })),

  deactivate: (scheduleId: string, signal?: AbortSignal) =>
    unwrap<void>(api.post(ENDPOINTS.trainingSchedules.deactivate(scheduleId), null, { signal })),

  generateByClub: (clubId: string, dto: GenerateTrainingSchedulesDto, signal?: AbortSignal) =>
    unwrap<number>(api.post(ENDPOINTS.trainingSchedules.generateByClub(clubId), dto, { signal })),

  createSession: (scheduleId: string, dto: CreateTrainingSessionDto, signal?: AbortSignal) =>
    unwrap<string>(api.post(ENDPOINTS.trainingSchedules.createSession(scheduleId), dto, { signal })),
} as const;