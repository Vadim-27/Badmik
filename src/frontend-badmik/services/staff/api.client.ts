


// src/services/staff/api.client.ts
import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';
import type { Staff, StaffRegisterDto, UpdateStaffDto, ChangeStaffPasswordDto } from '../types/staff.dto';
import { withQuery } from '@/lib/http/qs';

type ListParams = { clubId?: string; page?: number; pageSize?: number };

export const staffApiClient = {

  list: (params?: ListParams, signal?: AbortSignal) => {
    const url = withQuery(ENDPOINTS.staff.getAll, {
      ClubId: params?.clubId,
      Page: params?.page,
      PageSize: params?.pageSize,
    });
    return unwrap<Staff[]>(api.get(url, { signal }));
  },
  // list: (signal?: AbortSignal) =>
  //   unwrap<Staff[]>(api.get(ENDPOINTS.staff.getAll, { signal })),

  byId: (id: string, signal?: AbortSignal) =>
    unwrap<Staff>(api.get(ENDPOINTS.staff.getById(id), { signal })),

  // create: (dto: StaffRegisterDto, signal?: AbortSignal) =>
  //   unwrap<Staff>(api.post(ENDPOINTS.staff.register, dto, { signal })),
  create: (dto: StaffRegisterDto, signal?: AbortSignal) => {
  console.log(
    '%c[STAFF.CREATE → PAYLOAD2]',
    'color:red;font-weight:bold;',
    dto
  );

  return unwrap<Staff>(
    api.post(ENDPOINTS.staff.register, dto, { signal })
  );
},



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

  changePassword: (dto: ChangeStaffPasswordDto, signal?: AbortSignal) =>
    unwrap<void>(
      api.put(ENDPOINTS.staff.changePassword, dto, { signal }),
    ),

  

  // якщо додаси delete на бекові:
  // remove: (id: string, signal?: AbortSignal) =>
  //   unwrap<void>(api.delete(ENDPOINTS.staff.remove(id), { signal })),
} as const;