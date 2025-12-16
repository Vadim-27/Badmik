// src/services/clubs/api.client.ts
import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';
import { withQuery } from '@/lib/http/qs';
import type { Club, CreateClubDto, UpdateClubDto } from '@/services/types/clubs.dto';

type ListParams = { filter?: string };

export const clubsApiClient = {
  list: (params?: ListParams, signal?: AbortSignal) => {
    const url = withQuery(ENDPOINTS.clubs.getAll, {
      filter: params?.filter,
    });
    return unwrap<Club[]>(api.get(url, { signal }));
  },

  byId: (id: string, signal?: AbortSignal) =>
    unwrap<Club>(api.get(ENDPOINTS.clubs.getById(id), { signal })),

  create: (dto: CreateClubDto, signal?: AbortSignal) =>
    unwrap<Club>(api.post(ENDPOINTS.clubs.create, dto, { signal })),

  update: (id: string, dto: UpdateClubDto, signal?: AbortSignal) => {
    // приберемо undefined з dto
    const cleanDto = Object.fromEntries(
      Object.entries(dto).filter(([, v]) => v !== undefined),
    );

    return unwrap<Club>(
      api.put(ENDPOINTS.clubs.update(id), cleanDto, { signal }),
    );
  },

  delete: (id: string, signal?: AbortSignal) =>
    unwrap<void>(api.delete(ENDPOINTS.clubs.delete(id), { signal })),

  // activate: (id: string, signal?: AbortSignal) =>
  //   unwrap<void>(api.post(ENDPOINTS.clubs.activate(id), undefined, { signal })),

  // deactivate: (id: string, signal?: AbortSignal) =>
  //   unwrap<void>(
  //     api.post(ENDPOINTS.clubs.deactivate(id), undefined, { signal }),
  //   ),
    activate: (id: string, signal?: AbortSignal) =>
    unwrap<void>(api.post(ENDPOINTS.clubs.activate(id), null, { signal })),

  deactivate: (id: string, signal?: AbortSignal) =>
    unwrap<void>(api.post(ENDPOINTS.clubs.deactivate(id), null, { signal })),
} as const;

