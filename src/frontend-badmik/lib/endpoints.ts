export const ENDPOINTS = {
  auth: { login: "/Auth/login", refresh: "/Auth/refresh" },
  clubs: "/Clubs/GetAll",
  players: '/Player/GetAll', 
  usersRegister: "/Players/register",
  // staff: "/staff/GetAll",
  staff: {
    getAll:  "/staff/GetAll",
    getById: (id: string) => `/staff/${id}/GetById`,
    register: "/staff/Register",
    update: (id: string) => `/staff/${id}/Update`,
  },
} as const;