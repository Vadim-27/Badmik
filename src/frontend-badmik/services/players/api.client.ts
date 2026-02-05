// src/services/players/api.client.ts
import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';
import { withQuery } from '@/lib/http/qs';

import type { CreatePlayerDto, UpdatePlayerDto, Player, PlayerPhoto } from '@/services/types/players.dto';


type ListParams = { clubId?: string; page?: number; pageSize?: number };

export const playersApiClient = {
  list: (params: ListParams = {}, signal?: AbortSignal) => {
    const url = withQuery(ENDPOINTS.players.getAll, {
      ClubId: params.clubId,
      Page: params.page,
      PageSize: params.pageSize,
    });

    return unwrap<any>(api.get(url, { signal }));
  },

  byId: (id: string, signal?: AbortSignal) =>
    unwrap<Player>(api.get(ENDPOINTS.players.getById(id), { signal })),

  create: (dto: CreatePlayerDto, signal?: AbortSignal) =>
  unwrap<Player>(api.post(ENDPOINTS.players.create, dto, { signal })),

update: (id: string, dto: UpdatePlayerDto, signal?: AbortSignal) =>
  unwrap<Player>(api.put(ENDPOINTS.players.update(id), dto, { signal })),

uploadPhoto: (id: string, file: File, signal?: AbortSignal) => {
  const fd = new FormData();
  fd.append('file', file);

  return unwrap<PlayerPhoto>(
    api.put(ENDPOINTS.players.photo(id), fd, {
      signal,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  );
},

  // ✅ NEW: delete photo
  deletePhoto: (id: string, signal?: AbortSignal) =>
    unwrap<void>(api.delete(ENDPOINTS.players.photo(id), { signal })),

  // ✅ NEW: logo (часто це image/* або file stream)
  // якщо ваш api-wrapper (axios) підтримує responseType:
  logo: async (id: string, signal?: AbortSignal) => {
    const res = await api.get(ENDPOINTS.players.logo(id), {
      signal,
      responseType: 'blob',
    });
    return res.data as Blob;
  },
} as const;

