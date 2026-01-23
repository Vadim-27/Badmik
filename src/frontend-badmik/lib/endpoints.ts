export const ENDPOINTS = {
  auth: { login: '/Auth/login', refresh: '/Auth/refresh' },
  // clubs: "/Clubs/GetAll",
  players: '/Player/GetAll',
  usersRegister: '/Players/register',
  // staff: "/staff/GetAll",
  staff: {
    getAll: '/staffs',
    getById: (id: string) => `/staffs/${id}`,
    register: '/staffs',
    // update: (id: string) => `/staff/${id}/Update`,
    update: (id: string) => `/staffs/${id}`,
    changePassword: '/staffs/ChangePassword', 
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
    update: (id: string) => `/locations/${id}`,        
    delete: (id: string) => `/locations/${id}`,      
    byClub: (clubId: string) => `/locations/byclub/${clubId}`, 
  },

  player: {
    register: '/Player/Register', 
    getAll: '/players', 
    getById: (id: string) => `/Player/${id}/GetById`, 
    update: (id: string) => `/Player/${id}/Update`, 
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
