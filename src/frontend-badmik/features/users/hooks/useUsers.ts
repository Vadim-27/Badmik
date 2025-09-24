"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import type { CreateUserDto, UpdateUserDto, User } from "@/services/types/users.dto";


export const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: ({ signal }) => usersService.list(signal),
  });


export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateUserDto) => usersService.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};


export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) =>
      usersService.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};
