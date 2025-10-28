// // src/services/staff/api.client.ts
// import { api } from "@/lib/http/api";
// import { ENDPOINTS } from "@/lib/endpoints";
// import { unwrap } from "@/lib/http/utils";
// import type { Staff, StaffRegisterDto, UpdateStaffDto, StaffListResponse } from "../types/staff.dto";

// export const staffService = {
// //   async list({
// // signal,
// // page = 0,
// // pageSize = 10,
// // sort,
// // order,
// // filters,
// // }: {
// // signal?: AbortSignal;
// // page?: number;
// // pageSize?: number;
// // sort?: string;
// // order?: "asc" | "desc";
// // filters?: { field: string; operator: string; value?: string }[];
// // }): Promise<StaffListResponse> {
// // const qs = new URLSearchParams();
// // qs.set("page", String(page + 1)); // backend often 1-based
// // qs.set("limit", String(pageSize));
// // if (sort) qs.set("sort", sort);
// // if (order) qs.set("order", order);
// // if (filters?.length) qs.set("filters", JSON.stringify(filters));


// // const res = await fetch(`/api/staff?${qs.toString()}`, { signal });
// // if (!res.ok) throw new Error("Failed to fetch staff");
// // return res.json();
// // },

//   list: (signal?: AbortSignal) =>
//     unwrap<Staff[]>(api.get(ENDPOINTS.staff.getAll, { signal })),

//   get: (id: string, signal?: AbortSignal) =>
//     unwrap<Staff>(api.get(`${ENDPOINTS.staff}/${id}`, { signal })),

//   create: (dto: StaffRegisterDto, signal?: AbortSignal) =>
//     unwrap<Staff>(api.post(ENDPOINTS.staff.register, dto, { signal })),

//   // бек очікує PUT /api/staff (id у body), але фронт — як у users
// //   update: (id: string, dto: UpdateStaffDto, signal?: AbortSignal) =>
// //     unwrap<Staff>(api.put(ENDPOINTS.staff, { id, ...dto }, { signal })),
  
//   // якщо з’явиться delete і буде /api/staff/{id}:
//   // remove: (id: string, signal?: AbortSignal) =>
//   //   unwrap<void>(api.delete(`${ENDPOINTS.staff}/${id}`, { signal })),
// } as const;

//==================================


// src/services/staff/api.client.ts
import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';
import type { Staff, StaffRegisterDto, UpdateStaffDto } from '../types/staff.dto';

export const staffApiClient = {
  list: (signal?: AbortSignal) =>
    unwrap<Staff[]>(api.get(ENDPOINTS.staff.getAll, { signal })),

  byId: (id: string, signal?: AbortSignal) =>
    unwrap<Staff>(api.get(ENDPOINTS.staff.getById(id), { signal })),

  create: (dto: StaffRegisterDto, signal?: AbortSignal) =>
    unwrap<Staff>(api.post(ENDPOINTS.staff.register, dto, { signal })),

//   update: (id: string, dto: UpdateStaffDto, signal?: AbortSignal) =>
//     unwrap<Staff>(api.put(ENDPOINTS.staff.update(id), dto, { signal })),


  update: (id: string, dto: UpdateStaffDto, signal?: AbortSignal) => {
    // 🔎 лог перед відправкою
    console.log('%c[API → STAFF.UPDATE]', 'color:#00b3ff;font-weight:bold;', {
      endpoint: ENDPOINTS.staff.update(id),
      payload: dto,
    });

    // ✅ якщо хочеш, тут можна зробити очищення dto перед відправкою
    const cleanDto = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );

    return unwrap<Staff>(api.put(ENDPOINTS.staff.update(id), cleanDto, { signal }))
      .catch(err => {
        console.error('❌ [API → STAFF.UPDATE] failed with error:', err);
        throw err;
      });
  },

  // якщо додаси delete на бекові:
  // remove: (id: string, signal?: AbortSignal) =>
  //   unwrap<void>(api.delete(ENDPOINTS.staff.remove(id), { signal })),
} as const;