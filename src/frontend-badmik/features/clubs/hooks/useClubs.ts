"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clubsService} from "@/services/clubs.service";
import type { Club, CreateClubDto, UpdateClubDto } from "@/services/types/clubs.dto";
import { api } from "@/lib/http/api";



export function useClubs() {
  return useQuery<Club[]>({
    queryKey: ['clubs'],
    queryFn: async () => {
      const r = await api.get('/Clubs/GetAll');
      // бекенд інколи повертає { result: Club[] }
      return Array.isArray(r.data) ? r.data : r.data?.result ?? [];
    },
  });
}

export const useClub = (id: string) =>
  useQuery({
    queryKey: ["clubs", id],
    enabled: !!id,
    queryFn: ({ signal }) => clubsService.get(id, signal),
  });

export const useCreateClub = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["clubs", "create"],
    mutationFn: (dto: CreateClubDto) => clubsService.create(dto),
    onSuccess: (created: Club) => {
      qc.setQueryData<Club[]>(["clubs"], (prev) => (prev ? [created, ...prev] : [created]));
    },
  });
};

export const useUpdateClub = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["clubs", "update"],
    mutationFn: ({ id, dto }: { id: string; dto: UpdateClubDto }) => clubsService.update(id, dto),
    onSuccess: (updated: Club) => {
      qc.setQueryData<Club[]>(["clubs"], (prev) =>
        prev ? prev.map(c => (c.id === updated.id ? updated : c)) : prev
      );
      qc.setQueryData(["clubs", updated.id], updated);
    },
  });
};

export const useDeleteClub = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["clubs", "remove"],
    mutationFn: (id: string) => clubsService.remove(id),
    onSuccess: (_ , id) => {
      qc.setQueryData<Club[]>(["clubs"], (prev) => prev?.filter(c => c.id !== id) ?? prev);
      qc.removeQueries({ queryKey: ["clubs", id] });
    },
  });
};

export const useAssignAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["clubs", "assign-admin"],
    mutationFn: ({ clubId, adminId }: { clubId: string; adminId: string }) =>
      clubsService.assignAdmin(clubId, adminId),
    onSuccess: () => {
      // за потреби онови кеш (наприклад, useClub(clubId))
    },
  });
};
