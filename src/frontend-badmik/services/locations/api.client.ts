// src/services/locations/api.client.ts

import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';
import type {
  Location,
  CreateLocationDto,
  UpdateLocationDto,
} from '@/services/types/locations.dto';

type ListParams = { clubId?: string };

console.log('ENDPOINTS = ', ENDPOINTS);
console.log('ENDPOINTS.locations = ', ENDPOINTS.locations);

export const locationsApiClient = {
  list: (params?: ListParams, signal?: AbortSignal) => {
    if (params?.clubId) {
      return unwrap<Location[]>(
        api.get(ENDPOINTS.locations.byClub(params.clubId), { signal }),
      );
    }
    return unwrap<Location[]>(api.get(ENDPOINTS.locations.getAll, { signal }));
  },
   listByClub: (clubId: string, signal?: AbortSignal) =>
    unwrap<Location[]>(
      api.get(ENDPOINTS.locations.byClub(clubId), { signal }),
    ),

  byId: (id: string, signal?: AbortSignal) =>
    unwrap<Location>(api.get(ENDPOINTS.locations.getById(id), { signal })),

  create: (dto: CreateLocationDto, signal?: AbortSignal) =>
    unwrap<Location>(api.post(ENDPOINTS.locations.create, dto, { signal })),

  update: (id: string, dto: UpdateLocationDto, signal?: AbortSignal) => {
    const cleanDto = Object.fromEntries(
      Object.entries(dto).filter(([, v]) => v !== undefined),
    );
    return unwrap<Location>(
      api.put(ENDPOINTS.locations.update(id), cleanDto, { signal }),
    );
  },

  delete: (id: string, signal?: AbortSignal) =>
    unwrap<void>(api.delete(ENDPOINTS.locations.delete(id), { signal })),
} as const;
