import 'server-only';

import { serverFetch } from '@/lib/http/serverFetch';
import { ENDPOINTS } from '@/lib/endpoints';

import type {
  LocationMediaItem,
  UpdateLocationImagesOrderDto,
} from '@/services/types/locationMedia.dto';

export const locationMediaApiServer = {
  async getLogo(locationId: string): Promise<LocationMediaItem> {
    const res = await serverFetch(
      ENDPOINTS.locationMedia.logo.get(locationId),
      {},
      { revalidate: 60, tags: [`locationMedia:logo:${locationId}`] },
    );
    return res.json();
  },

  async listImages(locationId: string): Promise<LocationMediaItem[]> {
    const res = await serverFetch(
      ENDPOINTS.locationMedia.images.list(locationId),
      {},
      { revalidate: 60, tags: [`locationMedia:images:${locationId}`] },
    );
    return res.json();
  },

  
} as const;
