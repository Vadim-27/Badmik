// src/services/types/role.dto.ts
export type UUID = string;

export interface Role {
  id: UUID;
  name: string;

  permissions?: { id: UUID; name: string }[];
}

export type AssignRoleForUserDto = {
  staffId: string;  
  roleId: string;
  clubId: string;
};


export interface BindPermissionDto {
  roleId: UUID;
  permissionId: UUID;
}

export interface DeletePermissionDto {
  roleId: UUID;
  permissionId: UUID;
}
