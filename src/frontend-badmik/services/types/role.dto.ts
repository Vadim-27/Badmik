// src/services/types/role.dto.ts
export type UUID = string;

export interface Role {
  id: UUID;
  name: string;

  permissions?: { id: UUID; name: string }[];
}

export interface AssignRoleForUserDto {
  userId: UUID;
  clubId: UUID;
  roleId: UUID;
}


export interface BindPermissionDto {
  roleId: UUID;
  permissionId: UUID;
}

export interface DeletePermissionDto {
  roleId: UUID;
  permissionId: UUID;
}
