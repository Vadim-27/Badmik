// src/services/role/queries.client.ts

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
    queryFn: ({ signal }) => roleApiClient.listByClub(clubId as string, signal),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Ролі конкретного співробітника
export function useRolesByStaff(staffId: string | null | undefined) {
  return useQuery({
    enabled: !!staffId,
    queryKey: qk.role.listByStaff(staffId ?? 'none'),
    queryFn: ({ signal }) => roleApiClient.listByStaff(staffId as string, signal),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useAssignRoleForUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['role', 'assignToStaff'],
    mutationFn: (dto: AssignRoleForUserDto) => roleApiClient.assignToStaff(dto),
    onSuccess: (_res, vars) => {
      const v = vars as AssignRoleForUserDto;
      if (v.staffId) {
        qc.invalidateQueries({ queryKey: qk.role.listByStaff(v.staffId) });
      }
    },
  });
}

export function useBindPermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['role', 'bindPermission'],
    mutationFn: (dto: BindPermissionDto) => roleApiClient.bindPermission(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.role.listAll?.() ?? [] }),
  });
}

export function useDeletePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['role', 'deletePermission'],
    mutationFn: (dto: DeletePermissionDto) => roleApiClient.deletePermission(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.role.listAll?.() ?? [] }),
  });
}
