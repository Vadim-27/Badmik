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

export function useRoleList() {
  return useQuery({
    queryKey: qk.role.list(),
    queryFn: ({ signal }) => roleApiClient.list(signal),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useAssignRoleForUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['role', 'assignToUser'],
    mutationFn: (dto: AssignRoleForUserDto) => roleApiClient.assignToUser(dto),
    onSuccess: (_res, vars) => {
      //  оновити кеш стафа
      if ((vars as AssignRoleForUserDto).userId) {
        qc.invalidateQueries({ queryKey: ['staff','byId',(vars as AssignRoleForUserDto).userId] });
      }
    },
  });
}

export function useBindPermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['role', 'bindPermission'],
    mutationFn: (dto: BindPermissionDto) => roleApiClient.bindPermission(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.role.list() }),
  });
}

export function useDeletePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['role', 'deletePermission'],
    mutationFn: (dto: DeletePermissionDto) => roleApiClient.deletePermission(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.role.list() }),
  });
}
