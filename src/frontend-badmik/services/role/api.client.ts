// src/services/role/api.client.ts
import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';
import type {
  Role,
  AssignRoleForUserDto,   
  BindPermissionDto,
  DeletePermissionDto,
} from '../types/role.dto';

export const roleApiClient = {
  
  listByClub: (clubId: string, signal?: AbortSignal) =>
    unwrap<Role[]>(api.get(ENDPOINTS.role.getByClub(clubId), { signal })),

  // GET /api/roles/GetRolesByStaffId?staffId=...&clubId=...
  listByStaff: (staffId: string, signal?: AbortSignal) =>
  unwrap<Role[]>(
    api.get(ENDPOINTS.role.getByStaffId(staffId), { signal }),
  ),

  // POST /api/roles/AssignRoleForStaff
  assignToStaff: (dto: AssignRoleForUserDto, signal?: AbortSignal) =>
    unwrap<void>(api.post(ENDPOINTS.role.assignToStaff, dto, { signal })),

  // PUT /api/roles/BindPermission
  bindPermission: (dto: BindPermissionDto, signal?: AbortSignal) =>
    unwrap<void>(api.put(ENDPOINTS.role.bindPermission, dto, { signal })),

  // DELETE /api/roles/DeletePermission
  deletePermission: (dto: DeletePermissionDto, signal?: AbortSignal) =>
    unwrap<void>(
      api.delete(ENDPOINTS.role.deletePermission, { data: dto, signal }),
    ),
} as const;
