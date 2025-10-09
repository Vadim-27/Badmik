"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import type { CreateUserDto, UpdateUserDto, User } from "@/services/types/users.dto";


export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: ({ signal }) => usersService.list(signal),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["users", "create"],
    mutationFn: (dto: CreateUserDto) => usersService.create(dto),
    onSuccess: () => {
      // оновлюємо кеш списку
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}


export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) =>
      usersService.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};
