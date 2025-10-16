// src/services/staff.service.ts
import { api } from "@/lib/http/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { unwrap } from "@/lib/http/utils";
import type { Staff, StaffRegisterDto, UpdateStaffDto } from "./types/staff.dto";

export const staffService = {
  list: (signal?: AbortSignal) =>
    unwrap<Staff[]>(api.get(ENDPOINTS.staff.getAll, { signal })),

  get: (id: string, signal?: AbortSignal) =>
    unwrap<Staff>(api.get(`${ENDPOINTS.staff}/${id}`, { signal })),

  create: (dto: StaffRegisterDto, signal?: AbortSignal) =>
    unwrap<Staff>(api.post(ENDPOINTS.staff.register, dto, { signal })),

  // бек очікує PUT /api/staff (id у body), але фронт — як у users
//   update: (id: string, dto: UpdateStaffDto, signal?: AbortSignal) =>
//     unwrap<Staff>(api.put(ENDPOINTS.staff, { id, ...dto }, { signal })),
  
  // якщо з’явиться delete і буде /api/staff/{id}:
  // remove: (id: string, signal?: AbortSignal) =>
  //   unwrap<void>(api.delete(`${ENDPOINTS.staff}/${id}`, { signal })),
} as const;


