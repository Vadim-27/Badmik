import 'server-only';
import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';
import type { ClubSettings, UpdateClubSettingsDto } from '@/services/types/clubSettings.dto';

export const clubSettingsApiServer = {
  async byClubId(clubId: string): Promise<ClubSettings> {
    const res = await serverFetch(
      ENDPOINTS.clubSettings.get(clubId),
      {},
      { revalidate: 60, tags: [`clubSettings:${clubId}`] },
    );
    return res.json();
  },

  async update(clubId: string, dto: UpdateClubSettingsDto): Promise<ClubSettings> {
    const res = await serverFetch(
      ENDPOINTS.clubSettings.update(clubId),
      { method: 'PUT', body: JSON.stringify(dto) },
      { revalidate: 0, tags: [`clubSettings:${clubId}`] },
    );
    return res.json();
  },
} as const;
