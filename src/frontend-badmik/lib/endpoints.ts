export const ENDPOINTS = {
  auth: { login: '/Auth/login', refresh: '/Auth/refresh' },
  // clubs: "/Clubs/GetAll",
 
  usersRegister: '/Players/register',
  // staff: "/staff/GetAll",
  staff: {
    getAll: '/staffs',
    getById: (id: string) => `/staffs/${id}`,
    register: '/staffs',
    // update: (id: string) => `/staff/${id}/Update`,
    update: (id: string) => `/staffs/${id}`,
    changePassword: '/staffs/ChangePassword', 
    getByUserId: (userId: string) => `/staffs/user/${userId}`,
  },

 role: {
   
    getByClub: (clubId: string) => `/clubs/${clubId}/roles`,


    getByStaffId: (staffId: string) => `/staff/${staffId}/roles`,

    
    assignToStaff: (clubId: string, staffId: string, roleId: string) =>
      `/clubs/${clubId}/staff/${staffId}/roles/${roleId}`,

    removeFromStaff: (clubId: string, staffId: string, roleId: string) =>
      `/clubs/${clubId}/staff/${staffId}/roles/${roleId}`,

    bindPermission: (roleId: string, permissionId: string) =>
      `/roles/${roleId}/permissions/${permissionId}`,

    deletePermission: (roleId: string, permissionId: string) =>
      `/roles/${roleId}/permissions/${permissionId}`,
  },
   clubs: {
    getAll: '/clubs',                         
    getById: (id: string) => `/clubs/${id}`,  
    create: '/clubs',                         
    update: (id: string) => `/clubs/${id}`,   
    delete: (id: string) => `/clubs/${id}`,   
    activate: (id: string) => `/clubs/${id}/activate`,
    deactivate: (id: string) => `/clubs/${id}/deactivate`,
  },
   locations: {
    getAll: '/locations',                               
    getById: (id: string) => `/locations/${id}`,        
    create: '/locations',                              
    update: (id: string) => `/locations/${id}/photo`,        
    delete: (id: string) => `/locations/${id}/photo`,      
    byClub: (clubId: string) => `/locations/byclub/${clubId}`, 
  },

  players: {
    getAll: '/players',
    getById: (id: string) => `/players/${id}`,
    create: '/players',
    update: (id: string) => `/players/${id}`,
    photo: (id: string) => `/players/${id}/photo`,
    logo: (id: string) => `/players/${id}/logo`,
  },
  clubMembershipPlans: {
    list: (clubId: string) => `/clubs/${clubId}/membership-plans`,
    create: (clubId: string) => `/clubs/${clubId}/membership-plans`,
    byId: (clubId: string, planId: string) => `/clubs/${clubId}/membership-plans/${planId}`,
    update: (clubId: string, planId: string) => `/clubs/${clubId}/membership-plans/${planId}`,
    delete: (clubId: string, planId: string) => `/clubs/${clubId}/membership-plans/${planId}`,
  },
   playerMemberships: {
    list: (playerId: string) => `/players/${playerId}/memberships`,
    create: (playerId: string) => `/players/${playerId}/memberships`,
    byId: (playerId: string, membershipId: string) =>
      `/players/${playerId}/memberships/${membershipId}`,
    update: (playerId: string, membershipId: string) =>
      `/players/${playerId}/memberships/${membershipId}`,
    delete: (playerId: string, membershipId: string) =>
      `/players/${playerId}/memberships/${membershipId}`,
  },
  trainings: {
    getAll: '/Trainings/GetAll',
    getById: (id: string) => `/Trainings/${id}/GetById`,
    create: '/Trainings/Create',
    update: (id: string) => `/Trainings/${id}/Update`,
    delete: (id: string) => `/Trainings/${id}/Delete`,
    cancel: (id: string) => `/Trainings/${id}/Cancel`,
    joinQueue: (id: string) => `/Trainings/${id}/JoinQueue`,
    leaveQueue: (id: string) => `/Trainings/${id}/LeaveQueue`,
    getParticipants: (id: string) => `/Trainings/${id}/GetParticipants`,
    getQueue: (id: string) => `/Trainings/${id}/GetQueue`,
  },
} as const;
