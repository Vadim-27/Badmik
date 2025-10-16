import { api } from "@/lib/http/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { CreatePlayerDto, UpdatePlayerDto, Player } from "./types/players.dto";
import { unwrap, ApiError } from "@/lib/http/utils";

export function dateToIsoStartOfDay(dateStr: string) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  // UTC, щоб уникнути зсувів таймзони
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0)).toISOString();
}

export const usersService = {
  // list: (signal?: AbortSignal) =>
  //   api.get<User[]>(ENDPOINTS.users, { signal }).then(r => r.data),

  // /**
  //  * POST /api/Users/register — створення користувача
  //  */
  // create: (dto: CreateUserDto, signal?: AbortSignal) =>
  //   api.post<User>(ENDPOINTS.usersRegister, dto, { signal }).then(r => r.data),


  list: (signal?: AbortSignal) =>
    unwrap<Player[]>(api.get(ENDPOINTS.players, { signal })),

  create: (dto: CreatePlayerDto, signal?: AbortSignal) =>
    unwrap<Player>(api.post(ENDPOINTS.usersRegister, dto, { signal })),


  // create: (dto: CreateUserDto, signal?: AbortSignal) =>
  //   unwrap<User>(api.post(ENDPOINTS.users, dto, { signal })),

  update: (id: string, dto: UpdatePlayerDto, signal?: AbortSignal) =>
    unwrap<Player>(api.put(`${ENDPOINTS.players}/${id}`, dto, { signal })),

  remove: (id: string, signal?: AbortSignal) =>
    unwrap<void>(api.delete(`${ENDPOINTS.players}/${id}`, { signal })),
};
