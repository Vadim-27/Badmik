// src/services/types/locations.dto.ts

import type { WorkingHourDto } from '@/app/components/ui/WorkingHoursField/WorkingHoursField';

export type SportType =
  | 'Badminton'
  | 'Squash'
  | 'Padel'
  | 'Pickleball'
  | 'Tennis'
  | 'TableTennis';

export type LocationLabelType =
  | 'None'
  | 'New'
  | 'Popular'
  | 'Recommended'
  | 'Promotion'
  | 'Verified';

export type AmenityType =
  | 'Parking'
  | 'Water'
  | 'AirConditioning'
  | 'Shower'
  | 'VinylFloor'
  | 'ParquetFloor'
  | 'RubberFloor'
  | 'ConcreteFloor'
  | 'WiFi'
  | 'LockerRoom'
  | 'Toilet'
  | 'Cafe';

export type LocationSportDto = {
  sportType: SportType;
  courtCount: number;
};

export type LocationImageDto = {
  id: string;
  url: string | null;
  order: number;
  isMain: boolean;
};

export type Location = {
  id: string;
  clubId: string;
  name: string | null;
  city: string | null;
  address: string | null;
  label: LocationLabelType;
  isActive: boolean;
  order: number;
  priceText: string | null;
  description: string | null;
  courtCount: number;
  sportTypes: SportType[] | null;
  sports: LocationSportDto[] | null;
  logo: string | null;
  amenities: AmenityType[] | null;
  images: LocationImageDto[] | null;
  workingHours: WorkingHourDto;
  createdAt: string;
  updatedAt: string;
};

// DTO для створення
export type CreateLocationDto = {
  clubId: string;
  name: string | null;
  city: string | null;
  address: string | null;
  label: LocationLabelType;
  isActive: boolean;
  order: number;
  priceText: string | null;
  description: string | null;
  logo: string | null;
  amenities: AmenityType[] | null;
  sports: LocationSportDto[] | null;
  workingHours: WorkingHourDto;
};

// DTO для оновлення
export type UpdateLocationDto = Partial<CreateLocationDto>;
