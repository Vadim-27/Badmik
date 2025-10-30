// src/services/_shared/queryKeys.ts
export const qk = {
  staff: {
    list: (params?: unknown) => ['staff', 'list', params ?? {}] as const,
    byId: (id: string) => ['staff', 'byId', id] as const,
  },
  role: {
    list: () => ['role', 'list'] as const,
    // byId: (id: string) => ['role', 'byId', id] as const, 
  },
  clubs: {
    list: () => ['clubs', 'list'] as const,
    byId: (id: string) => ['clubs','byId', id] as const, 
  },
  players: {
    list: () => ['players', 'list'] as const,
    byId: (id: string) => ['players', 'byId', id] as const,
  },
   trainings: {
    list: () => ['trainings', 'list'] as const,
    byId: (id: string) => ['trainings', 'byId', id] as const,
    participants: (id: string) => ['trainings', 'participants', id] as const,
    queue: (id: string) => ['trainings', 'queue', id] as const,
  },
  
};