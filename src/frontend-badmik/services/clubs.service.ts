import { api } from "@/lib/http/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { Club, CreateClubDto, UpdateClubDto } from "./types/clubs.dto";
import { unwrap, ApiError } from "@/lib/http/utils";

export const clubsService = {
  // list: (signal?: AbortSignal) => unwrap<Club[]>(api.get(ENDPOINTS.clubs, { signal })),
    list: (signal?: AbortSignal) =>
    api.get<Club[]>('/Clubs', { signal }).then(r => r.data),
 
  get: (id: string, signal?: AbortSignal) => unwrap<Club>(api.get(`${ENDPOINTS.clubs}/${id}`, { signal })),
  create: (dto: CreateClubDto, signal?: AbortSignal) => unwrap<Club>(api.post(ENDPOINTS.clubs, dto, { signal })),
  update: (id: string, dto: UpdateClubDto, signal?: AbortSignal) => unwrap<Club>(api.put(`${ENDPOINTS.clubs}/${id}`, dto, { signal })),
  remove: (id: string, signal?: AbortSignal) => unwrap<void>(api.delete(`${ENDPOINTS.clubs}/${id}`, { signal })),

  assignAdmin: (clubId: string, adminId: string, signal?: AbortSignal) =>
    unwrap<void>(api.put(`${ENDPOINTS.clubs}/${clubId}/assign-admin`, { adminId }, { signal })),


};

