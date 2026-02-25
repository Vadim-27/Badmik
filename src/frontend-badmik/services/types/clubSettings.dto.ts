export type ClubSettings = {
  clubId: string;

  bookingOpenBeforeDays: number;
  unsubscribeAllowBeforeHours: number;
  bookingOpenHour: number;
};

export type UpdateClubSettingsDto = {
  bookingOpenBeforeDays: number;
  unsubscribeAllowBeforeHours: number;
  bookingOpenHour: number;
};
