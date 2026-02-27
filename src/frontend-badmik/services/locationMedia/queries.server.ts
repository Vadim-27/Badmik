import 'server-only';

import { qk } from '@/services/_shared/queryKeys';
import { locationMediaApiServer } from './api.server';

export const locationMediaServerQueries = {
  logo: (locationId: string) => ({
    queryKey: qk.locationMedia.logo(locationId),
    queryFn: () => locationMediaApiServer.getLogo(locationId),
  }),

  images: (locationId: string) => ({
    queryKey: qk.locationMedia.images(locationId),
    queryFn: () => locationMediaApiServer.listImages(locationId),
  }),
};
