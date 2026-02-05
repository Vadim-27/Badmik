export type Gender = 'NotSet' | 'Male' | 'Female' | (string & {});

/** вкладений user, який приходить в Player.user */
export type PlayerUser = {
  id?: string;
  email?: string | null;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  doB?: string | null;          // ISO string
  gender: Gender;
  phoneNumber?: string | null;
};

export type PlayerSportProfile = {
  sport?: string | null;
  level?: string | null;
};

export type Player = {
  id: string;
  clubId?: string | null;

  // ✅ реальний бек-шейп
  user?: PlayerUser | null;

  // ✅ fallback якщо бек інколи віддає "пласко"
  email?: string | null;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  doB?: string | null;
  gender?: Gender | null;
  phoneNumber?: string | null;

  sportProfiles?: PlayerSportProfile[] | null;
};

/** для GET /api/players */
export type PlayersListParams = {
  clubId?: string;
  page?: number;
  pageSize?: number;
};

/** DTO для POST /api/players */
export type CreatePlayerDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  clubId: string;
  gender: Gender;
  doB: string; // ISO string
  sportProfiles: PlayerSportProfile[];
};

/** DTO для PUT /api/players/{id} */
export type UpdatePlayerDto = {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  clubId?: string;
  gender?: Gender;
  doB?: string | null; // ISO string or null
  sportProfiles?: PlayerSportProfile[];
};

export type PlayerPhoto = {
  id: string;
  url: string;
  thumbUrl?: string | null;
  sortOrder?: number | null;
  contentType?: string | null;
  sizeBytes?: number | null;
  createdAt?: string | null;
};


//===========================

