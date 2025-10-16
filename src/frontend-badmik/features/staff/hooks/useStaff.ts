// src/features/staff/hooks.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "@/services/staff.service";
import type { Staff, StaffRegisterDto, UpdateStaffDto } from "@/services/types/staff.dto";

export function useStaff() {
  return useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: ({ signal }) => staffService.list(signal),
  });
}

export function useCreateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["staff", "create"],
    mutationFn: (dto: StaffRegisterDto) => staffService.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

// export const useUpdateStaff = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, dto }: { id: string; dto: UpdateStaffDto }) =>
//       staffService.update(id, dto),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
//   });
// };

