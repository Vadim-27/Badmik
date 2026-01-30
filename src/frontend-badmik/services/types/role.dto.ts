// src/services/types/role.dto.ts

export type UUID = string;

export interface Permission {
  id: UUID;
  name: string;
}

export interface Role {
  id: UUID;
  name: string;
  permissions?: Permission[];
}

/**
 * POST/DELETE: /api/clubs/{clubId}/staff/{staffId}/roles/{roleId}
 */
export interface StaffRoleParams {
  clubId: UUID;
  staffId: UUID;
  roleId: UUID;
}

/**
 * POST/DELETE: /api/roles/{roleId}/permissions/{permissionId}
 */
export interface RolePermissionParams {
  roleId: UUID;
  permissionId: UUID;
}
