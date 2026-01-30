// src/services/role/queries.client.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { qk } from '../_shared/queryKeys';
import { roleApiClient } from './api.client';
import type { StaffRoleParams, RolePermissionParams } from '../types/role.dto';

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

export function useAssignRoleForStaff() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['role', 'assignToStaff'],
    
    mutationFn: (p: StaffRoleParams) => {
  console.log('mutationFn p =', p);
  return roleApiClient.assignToStaff(p);
},
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: qk.role.listByStaff(vars.staffId) });
      qc.invalidateQueries({ queryKey: qk.role.listByClub(vars.clubId) });
    },
  });
}

export function useRemoveRoleFromStaff() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['role', 'removeFromStaff'],
    mutationFn: (p: StaffRoleParams) => roleApiClient.removeFromStaff(p),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: qk.role.listByStaff(vars.staffId) });
      qc.invalidateQueries({ queryKey: qk.role.listByClub(vars.clubId) });
    },
  });
}

export function useBindPermission() {
  return useMutation({
    mutationKey: ['role', 'bindPermission'],
    mutationFn: (p: RolePermissionParams) => roleApiClient.bindPermission(p),
  });
}

export function useDeletePermission() {
  return useMutation({
    mutationKey: ['role', 'deletePermission'],
    mutationFn: (p: RolePermissionParams) => roleApiClient.deletePermission(p),
  });
}

