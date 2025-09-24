export type Role = "super_admin" | "club_admin" | "coach" | "assistant" | "user";

export type CreateUserDto = {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  clubId?: string;
};

export type UpdateUserDto = Partial<Omit<CreateUserDto, "password">> & {
  password?: string;
};

export type User = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  clubId?: string | null;
  createdAt: string;
};
