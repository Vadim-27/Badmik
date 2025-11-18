// src/services/role/queries.client.ts
// 'use client';

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { qk } from '../_shared/queryKeys';
// import { roleApiClient } from './api.client';
// import type {
//   AssignRoleForUserDto,
//   BindPermissionDto,
//   DeletePermissionDto,
// } from '../types/role.dto';

// export function useRoleList() {
//   return useQuery({
//     queryKey: qk.role.list(),
//     queryFn: ({ signal }) => roleApiClient.list(signal),
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//   });
// }

// export function useAssignRoleForUser() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationKey: ['role', 'assignToUser'],
//     mutationFn: (dto: AssignRoleForUserDto) => roleApiClient.assignToUser(dto),
//     onSuccess: (_res, vars) => {
//       //  оновити кеш стафа
//       if ((vars as AssignRoleForUserDto).userId) {
//         qc.invalidateQueries({ queryKey: ['staff','byId',(vars as AssignRoleForUserDto).userId] });
//       }
//     },
//   });
// }

// export function useBindPermission() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationKey: ['role', 'bindPermission'],
//     mutationFn: (dto: BindPermissionDto) => roleApiClient.bindPermission(dto),
//     onSuccess: () => qc.invalidateQueries({ queryKey: qk.role.list() }),
//   });
// }

// export function useDeletePermission() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationKey: ['role', 'deletePermission'],
//     mutationFn: (dto: DeletePermissionDto) => roleApiClient.deletePermission(dto),
//     onSuccess: () => qc.invalidateQueries({ queryKey: qk.role.list() }),
//   });
// }


//==========================


'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { qk } from '../_shared/queryKeys';
import { roleApiClient } from './api.client';
import type {
  AssignRoleForUserDto,
  BindPermissionDto,
  DeletePermissionDto,
} from '../types/role.dto';

// Ролі клубу
export function useRoleListByClub(clubId: string | null | undefined) {
  return useQuery({
    enabled: !!clubId,
    queryKey: qk.role.listByClub(clubId ?? 'none'),
    queryFn: ({ signal }) =>
      roleApiClient.listByClub(clubId as string, signal),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Ролі конкретного співробітника
export function useRolesByStaff(staffId: string, clubId: string) {
  return useQuery({
    enabled: !!staffId && !!clubId,
    queryKey: qk.role.listByStaff(staffId, clubId),
    queryFn: ({ signal }) =>
      roleApiClient.listByStaff(staffId, clubId, signal),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useAssignRoleForUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['role', 'assignToStaff'],
    mutationFn: (dto: AssignRoleForUserDto) =>
      roleApiClient.assignToStaff(dto),
    onSuccess: (_res, vars) => {
      const v = vars as AssignRoleForUserDto;
      // інвалідуємо ролі цього staff/user (підлаштуй під свій qk)
      if (v.userId && (v as any).clubId) {
        qc.invalidateQueries({
          queryKey: qk.role.listByStaff(v.userId, (v as any).clubId),
        });
      }
    },
  });
}

export function useBindPermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['role', 'bindPermission'],
    mutationFn: (dto: BindPermissionDto) =>
      roleApiClient.bindPermission(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.role.listAll?.() ?? [] }),
  });
}

export function useDeletePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['role', 'deletePermission'],
    mutationFn: (dto: DeletePermissionDto) =>
      roleApiClient.deletePermission(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.role.listAll?.() ?? [] }),
  });
}
