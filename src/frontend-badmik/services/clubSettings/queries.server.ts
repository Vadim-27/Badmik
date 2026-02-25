import 'server-only';
import { qk } from '@/services/_shared/queryKeys';
import { clubSettingsApiServer } from './api.server';

export const clubSettingsServerQueries = {
  byClubId: (clubId: string) => ({
    queryKey: qk.clubSettings.byClubId(clubId),
    queryFn: () => clubSettingsApiServer.byClubId(clubId),
  }),
};
