// // src/services/role/api.server.ts
// import 'server-only';
// import { serverFetch } from '@/lib/http/serverFetch';
// import { ENDPOINTS } from '@/lib/endpoints';
// import type {
//   Role,
//   AssignRoleForUserDto,
//   BindPermissionDto,
//   DeletePermissionDto,
// } from '../types/role.dto';

// export const roleApiServer = {
//   async list(): Promise<Role[]> {
//     const res = await serverFetch(ENDPOINTS.role.getAll, {}, { revalidate: 60, tags: ['role'] });
//     return res.json();
//   },

//   async assignToUser(dto: AssignRoleForUserDto): Promise<void> {
//     await serverFetch(ENDPOINTS.role.assignToUser, {
//       method: 'POST',
//       body: JSON.stringify(dto),
//     });
//   },

//   async bindPermission(dto: BindPermissionDto): Promise<void> {
//     await serverFetch(ENDPOINTS.role.bindPermission, {
//       method: 'PUT',
//       body: JSON.stringify(dto),
//     });
//   },

//   async deletePermission(dto: DeletePermissionDto): Promise<void> {
//     await serverFetch(ENDPOINTS.role.deletePermission, {
//       method: 'DELETE',
//       body: JSON.stringify(dto),
//     });
//   },
// } as const;


//==========================

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
  // GET /api/roles/club/{id}
  async listByClub(clubId: string): Promise<Role[]> {
    const res = await serverFetch(
      ENDPOINTS.role.getByClub(clubId),
      {},
      { revalidate: 60, tags: ['role', `club:${clubId}`] },
    );
    return res.json();
  },

  // GET /api/roles/GetRolesByStaffId
  async listByStaff(staffId: string, clubId: string): Promise<Role[]> {
    const res = await serverFetch(
      ENDPOINTS.role.getByStaffId(staffId, clubId),
      {},
      { revalidate: 30, tags: ['role', `staff:${staffId}`, `club:${clubId}`] },
    );
    return res.json();
  },

  // POST /api/roles/AssignRoleForStaff
  async assignToStaff(dto: AssignRoleForUserDto): Promise<void> {
    await serverFetch(ENDPOINTS.role.assignToStaff, {
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
