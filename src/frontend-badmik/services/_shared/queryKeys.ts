// src/services/_shared/queryKeys.ts
type StaffListParams = {
  clubId?: string;
  page?: number;
  pageSize?: number;
};


export const qk = {
  staff: {
    // list: (params?: unknown) => ['staff', 'list', params ?? {}] as const,
    list: (params: StaffListParams = {}) => [
      'staff',
      'list',
      params.clubId ?? 'all',
      params.page ?? 1,
      params.pageSize ?? 10,
    ]  as const,
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
   locations: {
    list: (clubId?: string) => ['locations', 'list', clubId ?? 'all'] as const,
    byId: (id: string) => ['locations', 'byId', id] as const,
    byClub: (clubId: string) => ['locations', 'byClub', clubId] as const,
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