// src/services/staff/api.server.ts
import 'server-only';
import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';
import { withQuery } from '@/lib/http/qs';
import type { Staff, StaffRegisterDto, UpdateStaffDto } from '../types/staff.dto';

type ListParams = { clubId?: string; page?: number; pageSize?: number };

// export const staffApiServer = {
//   async list(): Promise<Staff[]> {
//     const res = await serverFetch(ENDPOINTS.staff.getAll, {}, { revalidate: 60, tags: ['staff'] });
//     return res.json();
//   },
export const staffApiServer = {
  async list(params: ListParams = {}): Promise<Staff[]> {
    // бек чекає ClubId у query → підставляємо лише якщо є
    const url = withQuery(ENDPOINTS.staff.getAll, {
      ClubId: params.clubId,
      Page: params.page,
      PageSize: params.pageSize,
    });

    const res = await serverFetch(url, {}, { revalidate: 60, tags: ['staff'] });
    return res.json();
  },

  async byId(id: string): Promise<Staff> {
    const res = await serverFetch(ENDPOINTS.staff.getById(id), {}, { revalidate: 60, tags: [`staff:${id}`] });
    return res.json();
  },

  async create(dto: StaffRegisterDto): Promise<Staff> {
    const res = await serverFetch(ENDPOINTS.staff.register, {
      method: 'POST',
      body: JSON.stringify(dto),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  async update(id: string, dto: UpdateStaffDto): Promise<Staff> {
    const res = await serverFetch(ENDPOINTS.staff.update(id), {
      method: 'PUT',
      body: JSON.stringify(dto),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },
} as const;
