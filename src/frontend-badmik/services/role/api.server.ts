// src/services/role/api.server.ts
import 'server-only';
import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';
import type {
  Role,
  AssignRoleForUserDto,
  BindPermissionDto,
  DeletePermissionDto,
} from '../types/role.dto';

export const roleApiServer = {
  async list(): Promise<Role[]> {
    const res = await serverFetch(ENDPOINTS.role.getAll, {}, { revalidate: 60, tags: ['role'] });
    return res.json();
  },

  async assignToUser(dto: AssignRoleForUserDto): Promise<void> {
    await serverFetch(ENDPOINTS.role.assignToUser, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  async bindPermission(dto: BindPermissionDto): Promise<void> {
    await serverFetch(ENDPOINTS.role.bindPermission, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },

  async deletePermission(dto: DeletePermissionDto): Promise<void> {
    await serverFetch(ENDPOINTS.role.deletePermission, {
      method: 'DELETE',
      body: JSON.stringify(dto),
    });
  },
} as const;
