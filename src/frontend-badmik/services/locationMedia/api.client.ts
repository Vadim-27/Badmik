import { api } from '@/lib/http/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { unwrap } from '@/lib/http/utils';

import type {
  LocationMediaItem,
  UpdateLocationImagesOrderDto,
} from '@/services/types/locationMedia.dto';

export const locationMediaApiClient = {
  // Logo
  getLogo: (locationId: string, signal?: AbortSignal) =>
    unwrap<LocationMediaItem>(api.get(ENDPOINTS.locationMedia.logo.get(locationId), { signal })),

  uploadLogo: (locationId: string, file: File, signal?: AbortSignal) => {
  const fd = new FormData();
  fd.append('file', file);

  return unwrap<LocationMediaItem>(
    api.put(ENDPOINTS.locationMedia.logo.put(locationId), fd, {
      signal,
      headers: { 'Content-Type': undefined as any },
    }),
  );
},

  deleteLogo: (locationId: string, signal?: AbortSignal) =>
    unwrap<void>(api.delete(ENDPOINTS.locationMedia.logo.delete(locationId), { signal })),

  // Images
  listImages: (locationId: string, signal?: AbortSignal) =>
    unwrap<LocationMediaItem[]>(
      api.get(ENDPOINTS.locationMedia.images.list(locationId), { signal }),
    ),

  uploadImages: async (locationId: string, files: File[], signal?: AbortSignal) => {
  const fd = new FormData();
  for (const f of files) fd.append('files', f);

  // КЛЮЧ: перетерти Content-Type, якщо wrapper його насильно ставить на JSON
  return unwrap<LocationMediaItem[]>(
    api.post(ENDPOINTS.locationMedia.images.upload(locationId), fd, {
      signal,
      headers: { 'Content-Type': undefined as any },
    }),
  );
},

  updateImagesOrder: (locationId: string, dto: UpdateLocationImagesOrderDto, signal?: AbortSignal) =>
    unwrap<void>(api.put(ENDPOINTS.locationMedia.images.updateOrder(locationId), dto, { signal })),

  deleteImage: (locationId: string, mediaId: string, signal?: AbortSignal) =>
    unwrap<void>(api.delete(ENDPOINTS.locationMedia.images.delete(locationId, mediaId), { signal })),
} as const;
