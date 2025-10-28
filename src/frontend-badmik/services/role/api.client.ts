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
  list: (signal?: AbortSignal) =>
    unwrap<Role[]>(api.get(ENDPOINTS.role.getAll, { signal })),

  assignToUser: (dto: AssignRoleForUserDto, signal?: AbortSignal) =>
    unwrap<void>(api.post(ENDPOINTS.role.assignToUser, dto, { signal })),

  bindPermission: (dto: BindPermissionDto, signal?: AbortSignal) =>
    unwrap<void>(api.put(ENDPOINTS.role.bindPermission, dto, { signal })),

  deletePermission: (dto: DeletePermissionDto, signal?: AbortSignal) =>
    unwrap<void>(api.delete(ENDPOINTS.role.deletePermission, { data: dto, signal })),
} as const;
