import { api } from "@/lib/http/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { CreateUserDto, UpdateUserDto, User } from "./types/users.dto";
import { unwrap, ApiError } from "@/lib/http/utils";

export const usersService = {
  list: (signal?: AbortSignal) =>
    unwrap<User[]>(api.get(ENDPOINTS.users, { signal })),

  get: (id: string, signal?: AbortSignal) =>
    unwrap<User>(api.get(`${ENDPOINTS.users}/${id}`, { signal })),

  create: (dto: CreateUserDto, signal?: AbortSignal) =>
    unwrap<User>(api.post(ENDPOINTS.users, dto, { signal })),

  update: (id: string, dto: UpdateUserDto, signal?: AbortSignal) =>
    unwrap<User>(api.put(`${ENDPOINTS.users}/${id}`, dto, { signal })),

  remove: (id: string, signal?: AbortSignal) =>
    unwrap<void>(api.delete(`${ENDPOINTS.users}/${id}`, { signal })),
};
