
export type Role = 'owner_admin' | 'assistant' | 'club_admin';

export const ROLES: Role[] = ['owner_admin', 'assistant', 'club_admin'];

export const PERMISSIONS = [
  'all',
  'view_users',
  'club_dashboard',
  'manage_bookings',
] as const;
export type Permission = typeof PERMISSIONS[number];

export type Admin = {
  id: string;
  email: string;
  password?: string;    
  role: Role;
  clubId?: string;
  permissions: Permission[];
};
