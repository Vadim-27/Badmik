export type Club = {
  id: string;
  name: string;
  city: string;
  address: string;
  priceFrom: number;
};

export type CreateClubDto = Omit<Club, "id">;
export type UpdateClubDto = Partial<CreateClubDto>;
