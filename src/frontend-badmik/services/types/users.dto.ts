export type Role = "super_admin" | "club_admin" | "coach" | "assistant" | "user";

export type CreateUserDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  clubId?: string;
  doB: string; // ISO-строка
};

export type UpdateUserDto = Partial<Omit<CreateUserDto, "password">> & {
  password?: string;
};

export type User = {
  id: string;
  email: string;
  fullName: string;   // бек може повертати склеєне "firstName lastName"
  role: Role;
  clubId?: string | null;
  createdAt: string;
};
