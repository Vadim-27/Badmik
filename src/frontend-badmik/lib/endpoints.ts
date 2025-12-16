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
  //  role: {
  //   getAll: '/role/GetAll',                      // GET
  //   assignToUser: '/role/AssignRoleForUser',     // POST
  //   bindPermission: '/role/BindPermission',      // PUT
  //   deletePermission: '/role/DeletePermission',  // DELETE
  // },
  role: {
    getByClub: (clubId: string) => `/roles/club/${clubId}`,

    assignToStaff: '/roles/AssignRoleForStaff',

    bindPermission: '/roles/BindPermission',

    deletePermission: '/roles/DeletePermission',
    getByStaffId: (staffId: string, clubId: string) =>
      `/roles/GetRolesByStaffId?staffId=${staffId}&clubId=${clubId}`,
  },
   clubs: {
    getAll: '/clubs',                         // GET /api/clubs
    getById: (id: string) => `/clubs/${id}`,  // GET /api/clubs/{id}
    create: '/clubs',                         // POST /api/clubs
    update: (id: string) => `/clubs/${id}`,   // PUT /api/clubs/{id}
    delete: (id: string) => `/clubs/${id}`,   // DELETE /api/clubs/{id}
    activate: (id: string) => `/clubs/${id}/activate`,
    deactivate: (id: string) => `/clubs/${id}/deactivate`,
  },
   locations: {
    getAll: '/locations',                               // GET /api/locations
    getById: (id: string) => `/locations/${id}`,        // GET /api/locations/{id}
    create: '/locations',                               // POST /api/locations
    update: (id: string) => `/locations/${id}`,         // PUT /api/locations/{id}
    delete: (id: string) => `/locations/${id}`,         // DELETE /api/locations/{id}
    byClub: (clubId: string) => `/locations/byclub/${clubId}`, // GET /api/locations/byclub/{clubId}
  },

  player: {
    register: '/Player/Register', // POST
    getAll: '/players', // GET
    getById: (id: string) => `/Player/${id}/GetById`, // GET
    update: (id: string) => `/Player/${id}/Update`, // PUT
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
