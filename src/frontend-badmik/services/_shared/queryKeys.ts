// src/services/_shared/queryKeys.ts
export const qk = {
  staff: {
    // list: (params?: unknown) => ['staff', 'list', params ?? {}] as const,
    list: (clubId?: string) => ['staff', 'list', clubId ?? 'all'] as const,
    byId: (id: string) => ['staff', 'byId', id] as const,
  },
  role: {
  
    listByClub: (clubId: string) => ['role', 'byClub', clubId] as const,


    listByStaff: (staffId: string, clubId: string) =>
      ['role', 'byStaff', staffId, clubId] as const,

  
    listAll: () => ['role', 'list'] as const,
  },
   clubs: {
   
    list: (filter?: string) => ['clubs', 'list', filter ?? ''] as const,
    byId: (id: string) => ['clubs', 'byId', id] as const,
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