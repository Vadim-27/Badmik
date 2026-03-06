// src/services/trainingSchedules/api.server.ts
import 'server-only';

import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';

import type { TrainingSchedule, TrainingSchedulesListParams } from '@/services/types/trainingSchedules.dto';

function toQuery(params?: TrainingSchedulesListParams) {
  if (!params) return '';
  const sp = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    sp.set(k, String(v));
  });

  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export const trainingSchedulesApiServer = {
  async byId(id: string): Promise<TrainingSchedule> {
    const res = await serverFetch(
      ENDPOINTS.trainingSchedules.byId(id),
      {},
      { revalidate: 60, tags: [`trainingSchedule:${id}`] },
    );
    return res.json();
  },

  async list(params?: TrainingSchedulesListParams): Promise<TrainingSchedule[]> {
    const url = `${ENDPOINTS.trainingSchedules.list}${toQuery(params)}`;

    const res = await serverFetch(
      url,
      {},
      { revalidate: 30, tags: ['trainingSchedules:list'] },
    );

    return res.json();
  },
} as const;