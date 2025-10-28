// "use client";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { usersService } from "@/services/players.service";
// import type { CreatePlayerDto, UpdatePlayerDto, Player } from "@/services/types/players.dto";


// export function usePlayers() {
//   return useQuery<Player[]>({
//     queryKey: ["players"],
//     queryFn: ({ signal }) => usersService.list(signal),
//   });
// }

// export function useCreatePlayer() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationKey: ["players", "create"],
//     mutationFn: (dto: CreatePlayerDto) => usersService.create(dto),
//     onSuccess: () => {
//       // оновлюємо кеш списку
//       qc.invalidateQueries({ queryKey: ["players"] });
//     },
//   });
// }


// export const useUpdatePlayer = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, dto }: { id: string; dto: UpdatePlayerDto }) =>
//       usersService.update(id, dto),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["players"] }),
//   });
// };
