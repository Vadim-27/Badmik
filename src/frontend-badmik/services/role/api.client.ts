// src/services/role/api.client.ts
import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';
import type { Role, StaffRoleParams, RolePermissionParams } from '../types/role.dto';

export const roleApiClient = {
  // GET /api/clubs/{clubId}/roles
  listByClub: (clubId: string, signal?: AbortSignal) =>
    unwrap<Role[]>(api.get(ENDPOINTS.role.getByClub(clubId), { signal })),

  // GET /api/staff/{staffId}/roles
  listByStaff: (staffId: string, signal?: AbortSignal) =>
    unwrap<Role[]>(api.get(ENDPOINTS.role.getByStaffId(staffId), { signal })),

  // POST /api/clubs/{clubId}/staff/{staffId}/roles/{roleId}
  assignToStaff: (p: StaffRoleParams, signal?: AbortSignal) =>
    unwrap<void>(
      api.post(ENDPOINTS.role.assignToStaff(p.clubId, p.staffId, p.roleId), null, {
        signal,
      }),
    ),

  // DELETE /api/clubs/{clubId}/staff/{staffId}/roles/{roleId}
  removeFromStaff: (p: StaffRoleParams, signal?: AbortSignal) =>
    unwrap<void>(
      api.delete(ENDPOINTS.role.removeFromStaff(p.clubId, p.staffId, p.roleId), {
        signal,
      }),
    ),

  // POST /api/roles/{roleId}/permissions/{permissionId}
  bindPermission: (p: RolePermissionParams, signal?: AbortSignal) =>
    unwrap<void>(
      api.post(ENDPOINTS.role.bindPermission(p.roleId, p.permissionId), null, { signal }),
    ),

  // DELETE /api/roles/{roleId}/permissions/{permissionId}
  deletePermission: (p: RolePermissionParams, signal?: AbortSignal) =>
    unwrap<void>(
      api.delete(ENDPOINTS.role.deletePermission(p.roleId, p.permissionId), { signal }),
    ),
} as const;


