// src/services/staff/queries.client.ts
'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
  type QueryKey,
} from '@tanstack/react-query';
import { qk } from '../_shared/queryKeys';
import { staffApiClient } from './api.client';
import type { Staff, StaffRegisterDto, UpdateStaffDto, ChangeStaffPasswordDto } from '../types/staff.dto';


export function useStaffList(
  params?: { clubId?: string },
  options?: Partial<UseQueryOptions<Staff[], unknown, Staff[], QueryKey>>
) {
  return useQuery({
    queryKey: qk.staff.list(params?.clubId),
    queryFn: ({ signal }) => staffApiClient.list({ clubId: params?.clubId }, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
}

// export function useStaffList(
//   options?: Partial<UseQueryOptions<Staff[], unknown, Staff[], QueryKey>>
// ) {
//   return useQuery({
//     queryKey: qk.staff.list(),
//     queryFn: ({ signal }) => staffApiClient.list(signal),
//     placeholderData: keepPreviousData,
//     staleTime: 5 * 60 * 1000,
//     retry: 1,
//     refetchOnWindowFocus: false,
//     ...(options ?? {}),
//   });
// }

type UseStaffByIdOptions = Partial<
  UseQueryOptions<Staff, unknown, Staff, QueryKey>
> & {
  initialData?: Staff;
};

export function useStaffById(id: string, options?: UseStaffByIdOptions) {
  return useQuery({
    queryKey: qk.staff.byId(id),
    queryFn: ({ signal }) => staffApiClient.byId(id, signal),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...(options ?? {}),
  });
}

export function useCreateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['staff', 'create'],
    mutationFn: (dto: StaffRegisterDto) => staffApiClient.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.staff.list() }),
  });
}

// export function useUpdateStaff(id: string) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationKey: ['staff', 'update', id],
//     mutationFn: (dto: UpdateStaffDto) => staffApiClient.update(id, dto),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: qk.staff.list() });
//       qc.invalidateQueries({ queryKey: qk.staff.byId(id) });
//     },
//   });
// }
// src/services/staff/queries.client.ts


export function useUpdateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['staff', 'update'],
    mutationFn: ({ id, dto }: { id: string; dto: UpdateStaffDto }) =>
      staffApiClient.update(id, dto),
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: qk.staff.list() });
      qc.invalidateQueries({ queryKey: qk.staff.byId(id) });
    },
  });
}


export function useChangeStaffPassword() {
  return useMutation({
    mutationKey: ['staff', 'changePassword'],
    mutationFn: (dto: ChangeStaffPasswordDto) =>
      staffApiClient.changePassword(dto),
  });
}


//=======================================

// src/services/staff/queries.client.ts
// 'use client';

// import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
// import { qk } from '../_shared/queryKeys';
// import { staffApiClient } from './api.client';
// import type { Staff, StaffRegisterDto, UpdateStaffDto } from '../types/staff.dto';

// export function useStaffList() {
//   return useQuery({
//     queryKey: qk.staff.list(),
//     queryFn: ({ signal }) => staffApiClient.list(signal),
//     placeholderData: keepPreviousData,
//     staleTime: 5 * 60 * 1000,
//     retry: 1,
//     refetchOnWindowFocus: false,
//   });
// }

// export function useStaffById(id: string) {
//   return useQuery({
//     queryKey: qk.staff.byId(id),
//     queryFn: ({ signal }) => staffApiClient.byId(id, signal),
//     enabled: !!id,
//     staleTime: 5 * 60 * 1000,
//   });
// }

// export function useCreateStaff() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationKey: ['staff', 'create'],
//     mutationFn: (dto: StaffRegisterDto) => staffApiClient.create(dto),
//     onSuccess: () => qc.invalidateQueries({ queryKey: qk.staff.list() }),
//   });
// }

// export function useUpdateStaff(id: string) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationKey: ['staff', 'update', id],
//     mutationFn: (dto: UpdateStaffDto) => staffApiClient.update(id, dto),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: qk.staff.list() });
//       qc.invalidateQueries({ queryKey: qk.staff.byId(id) });
//     },
//   });
// }