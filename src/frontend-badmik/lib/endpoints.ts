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
    update: (id: string) => `staffs/${id}`,
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
    getAll: '/Clubs/GetAll', // GET
    create: '/Clubs/Create', // POST
    update: (id: string) => `/Clubs/${id}/Update`, // PUT
    delete: (id: string) => `/Clubs/${id}/Delete`, // DELETE
  },
  player: {
    register: '/Player/Register', // POST
    getAll: '/Player/GetAll', // GET
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
