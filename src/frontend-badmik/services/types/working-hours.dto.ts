export type TimeRangeDto = { from: string | null; to: string | null };

export type WorkingHoursDto = {
  monday: TimeRangeDto | null;
  tuesday: TimeRangeDto | null;
  wednesday: TimeRangeDto | null;
  thursday: TimeRangeDto | null;
  friday: TimeRangeDto | null;
  saturday: TimeRangeDto | null;
  sunday: TimeRangeDto | null;
};
