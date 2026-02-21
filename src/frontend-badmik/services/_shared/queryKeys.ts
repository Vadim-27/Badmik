// src/services/_shared/queryKeys.ts
type StaffListParams = {
  clubId?: string;
  page?: number;
  pageSize?: number;
};
type PlayersListParams = {
  clubId?: string;
  page?: number;
  pageSize?: number;
};

type PlayerMembershipsListParams = {
  playerId: string;
  clubId?: string;
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
    byUserId: (userId: string) => ['staff', 'byUserId', userId] as const,
  },
  role: {
  
    listByClub: (clubId: string) => ['role', 'byClub', clubId] as const,


    listByStaff: (staffId: string) =>
      ['role', 'byStaff', staffId] as const,

  
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
    list: (params: PlayersListParams = {}) =>
      ['players', 'list', params.clubId ?? 'all', params.page ?? 1, params.pageSize ?? 10] as const,
    byId: (id: string) => ['players', 'byId', id] as const,
    create: () => ['players', 'create'] as const, 
    update: (id: string) => ['players', 'update', id] as const,
     photo: (id: string) => ['players', 'photo', id] as const,
    logo: (id: string) => ['players', 'logo', id] as const,
  },
  clubMembershipPlans: {
    list: (clubId: string) => ['clubMembershipPlans', 'list', clubId] as const,
    byId: (clubId: string, planId: string) => ['clubMembershipPlans', 'byId', clubId, planId] as const,
  },
  playerMemberships: {
    list: (params: PlayerMembershipsListParams) =>
      ['playerMemberships', 'list', params.playerId, params.clubId ?? 'all'] as const,

    byId: (playerId: string, membershipId: string) =>
      ['playerMemberships', 'byId', playerId, membershipId] as const,

    create: (playerId: string) => ['playerMemberships', 'create', playerId] as const,
    update: (playerId: string, membershipId: string) =>
      ['playerMemberships', 'update', playerId, membershipId] as const,
    delete: (playerId: string, membershipId: string) =>
      ['playerMemberships', 'delete', playerId, membershipId] as const,
  },
   trainings: {
    list: () => ['trainings', 'list'] as const,
    byId: (id: string) => ['trainings', 'byId', id] as const,
    participants: (id: string) => ['trainings', 'participants', id] as const,
    queue: (id: string) => ['trainings', 'queue', id] as const,
  },
  
};