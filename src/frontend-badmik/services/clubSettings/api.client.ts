import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';
import type { ClubSettings, UpdateClubSettingsDto } from '@/services/types/clubSettings.dto';

export const clubSettingsApiClient = {
  byClubId: (clubId: string, signal?: AbortSignal) =>
    unwrap<ClubSettings>(api.get(ENDPOINTS.clubSettings.get(clubId), { signal })),

  update: (clubId: string, dto: UpdateClubSettingsDto, signal?: AbortSignal) =>
    unwrap<ClubSettings>(api.put(ENDPOINTS.clubSettings.update(clubId), dto, { signal })),
} as const;
