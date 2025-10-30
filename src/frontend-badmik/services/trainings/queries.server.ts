// src/services/trainings/queries.server.ts
import 'server-only';
import { qk } from '../_shared/queryKeys';
import { trainingsApiServer } from './api.server';

export const trainingsServerQueries = {
  list: () => ({
    queryKey: qk.trainings.list(),
    queryFn: () => trainingsApiServer.list(),
  }),
  byId: (id: string) => ({
    queryKey: qk.trainings.byId(id),
    queryFn: () => trainingsApiServer.byId(id),
  }),
  participants: (id: string) => ({
    queryKey: qk.trainings.participants(id),
    queryFn: () => trainingsApiServer.getParticipants(id),
  }),
  queue: (id: string) => ({
    queryKey: qk.trainings.queue(id),
    queryFn: () => trainingsApiServer.getQueue(id),
  }),
};
