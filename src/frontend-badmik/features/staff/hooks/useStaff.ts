// // src/features/staff/hooks.ts
// "use client";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { staffService } from "@/services/staff.service";
// import type { Staff, StaffRegisterDto, UpdateStaffDto, StaffListResponse } from "@/services/types/staff.dto";

// export type StaffTableQuery = {
// page: number; // 0-based from DataGrid
// pageSize: number;
// sortModel: { field: string; sort: "asc" | "desc" }[];
// filterModel: { items: { field: string; operator: string; value?: string }[] };
// };

// export function useStaff() {
//   return useQuery<Staff[]>({
//     queryKey: ["staff"],
//     queryFn: ({ signal }) => staffService.list(signal),
//   });
// }

// // export function useStaff(params: StaffTableQuery) {
// // return useQuery<StaffListResponse>({
// // queryKey: [
// // "staff",
// // params.page,
// // params.pageSize,
// // params.sortModel,
// // params.filterModel,
// // ],
// // queryFn: ({ signal }) =>
// // staffService.list({
// // signal,
// // page: params.page,
// // pageSize: params.pageSize,
// // sort: params.sortModel?.[0]?.field,
// // order: params.sortModel?.[0]?.sort,
// // filters: params.filterModel?.items || [],
// // }),
// // // Keep previous data to avoid UI flicker while paginating
// // placeholderData: (prev) => prev,
// // });
// // }

// export function useCreateStaff() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationKey: ["staff", "create"],
//     mutationFn: (dto: StaffRegisterDto) => staffService.create(dto),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
//   });
// }

// // export const useUpdateStaff = () => {
// //   const qc = useQueryClient();
// //   return useMutation({
// //     mutationFn: ({ id, dto }: { id: string; dto: UpdateStaffDto }) =>
// //       staffService.update(id, dto),
// //     onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
// //   });
// // };

