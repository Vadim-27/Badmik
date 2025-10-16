export type Role = "super_admin" | "club_admin" | "coach" | "assistant" | "user";

export type CreatePlayerDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  clubId?: string;
  doB: string; // ISO-строка
};

export type UpdatePlayerDto = Partial<Omit<CreatePlayerDto, "password">> & {
  password?: string;
};

export type Player = {
  id: string;
  email: string;
  fullName: string;   // бек може повертати склеєне "firstName lastName"
  role: Role;
  clubId?: string | null;
  createdAt: string;
};
