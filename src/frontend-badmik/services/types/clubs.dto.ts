// types.ts

// src/services/types/club.dto.ts

export type Club = {
  id: string;
  name: string | null;
  city: string | null;
  alias: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  order: number;
  website: string | null;       
  description: string | null;  

  // якщо бек реально це віддає:
  // locationsCount?: number;
  locationCount: number;
};

// для створення
export type CreateClubDto = {
  name: string | null;
  city: string | null;
  alias: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  description: string | null;
  isActive: boolean;
  order: number;
};

// для оновлення (все опційно)
export type UpdateClubDto = Partial<CreateClubDto>;



// export type CreateClubDto = Omit<Club, "id">;
// export type UpdateClubDto = Partial<CreateClubDto>;
