// src/services/role/api.server.ts
import 'server-only';
import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Role, StaffRoleParams, RolePermissionParams } from '../types/role.dto';

export const roleApiServer = {
  // GET /api/clubs/{clubId}/roles
  async listByClub(clubId: string): Promise<Role[]> {
    const res = await serverFetch(
      ENDPOINTS.role.getByClub(clubId),
      {},
      { revalidate: 60, tags: ['role', `club:${clubId}`] },
    );
    return res.json();
  },

  // GET /api/staff/{staffId}/roles
  async listByStaff(staffId: string): Promise<Role[]> {
    const res = await serverFetch(
      ENDPOINTS.role.getByStaffId(staffId),
      {},
      { revalidate: 30, tags: ['role', `staff:${staffId}`] },
    );
    return res.json();
  },

  // POST /api/clubs/{clubId}/staff/{staffId}/roles/{roleId}
  async assignToStaff(p: StaffRoleParams): Promise<void> {
    await serverFetch(ENDPOINTS.role.assignToStaff(p.clubId, p.staffId, p.roleId), {
      method: 'POST',
    });
  },

  // DELETE /api/clubs/{clubId}/staff/{staffId}/roles/{roleId}
  async removeFromStaff(p: StaffRoleParams): Promise<void> {
    await serverFetch(ENDPOINTS.role.removeFromStaff(p.clubId, p.staffId, p.roleId), {
      method: 'DELETE',
    });
  },

  // POST /api/roles/{roleId}/permissions/{permissionId}
  async bindPermission(p: RolePermissionParams): Promise<void> {
    await serverFetch(ENDPOINTS.role.bindPermission(p.roleId, p.permissionId), {
      method: 'POST',
    });
  },

  // DELETE /api/roles/{roleId}/permissions/{permissionId}
  async deletePermission(p: RolePermissionParams): Promise<void> {
    await serverFetch(ENDPOINTS.role.deletePermission(p.roleId, p.permissionId), {
      method: 'DELETE',
    });
  },
} as const;

