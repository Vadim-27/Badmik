'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { qk } from '@/services/_shared/queryKeys';
import { locationMediaApiClient } from './api.client';

import type { LocationMediaItem, UpdateLocationImagesOrderDto } from '@/services/types/locationMedia.dto';

type UseLogoOptions = Partial<UseQueryOptions<LocationMediaItem, unknown, LocationMediaItem, QueryKey>>;
type UseImagesOptions = Partial<UseQueryOptions<LocationMediaItem[], unknown, LocationMediaItem[], QueryKey>>;

export function useLocationLogo(locationId: string, options?: UseLogoOptions) {
  return useQuery({
    queryKey: qk.locationMedia.logo(locationId),
    queryFn: ({ signal }) => locationMediaApiClient.getLogo(locationId, signal),
    enabled: !!locationId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
}

export function useLocationImages(locationId: string, options?: UseImagesOptions) {
  return useQuery({
    queryKey: qk.locationMedia.images(locationId),
    queryFn: ({ signal }) => locationMediaApiClient.listImages(locationId, signal),
    enabled: !!locationId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
}



export function useUploadLocationLogo(locationId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['locationMedia', 'logo', 'upload', locationId],
    mutationFn: (file: File) => locationMediaApiClient.uploadLogo(locationId, file),

    onSuccess: (updatedLogo) => {
     
      qc.setQueryData(qk.locationMedia.logo(locationId), updatedLogo);
    },
  });
}

export function useDeleteLocationLogo(locationId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['locationMedia', 'logo', 'delete', locationId],
    mutationFn: () => locationMediaApiClient.deleteLogo(locationId),

    onSuccess: () => {
     
      qc.removeQueries({ queryKey: qk.locationMedia.logo(locationId) });
    },
  });
}

export function useUploadLocationImages(locationId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['locationMedia', 'images', 'upload', locationId],
    mutationFn: (files: File[]) => locationMediaApiClient.uploadImages(locationId, files),

    onSuccess: (newItems) => {
  
      qc.setQueryData<LocationMediaItem[]>(qk.locationMedia.images(locationId), (old) => {
        const prev = old ?? [];
        
        const map = new Map(prev.map((x) => [x.id, x]));
        newItems.forEach((x) => map.set(x.id, x));
        return Array.from(map.values()).sort((a, b) => a.sortOrder - b.sortOrder);
      });
    },
  });
}

export function useDeleteLocationImage(locationId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['locationMedia', 'images', 'delete', locationId],
    mutationFn: (mediaId: string) => locationMediaApiClient.deleteImage(locationId, mediaId),

    onSuccess: (_res, mediaId) => {
      qc.setQueryData<LocationMediaItem[]>(qk.locationMedia.images(locationId), (old) =>
        (old ?? []).filter((x) => x.id !== mediaId),
      );
    },
  });
}

export function useUpdateLocationImagesOrder(locationId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['locationMedia', 'images', 'order', locationId],
    mutationFn: (dto: UpdateLocationImagesOrderDto) =>
      locationMediaApiClient.updateImagesOrder(locationId, dto),

    onMutate: async (dto) => {
      await qc.cancelQueries({ queryKey: qk.locationMedia.images(locationId) });
      const prev = qc.getQueryData<LocationMediaItem[]>(qk.locationMedia.images(locationId));

    
      qc.setQueryData<LocationMediaItem[]>(qk.locationMedia.images(locationId), (old) => {
        const arr = [...(old ?? [])];
        const order = new Map(dto.items.map((i) => [i.id, i.sortOrder]));
        return arr
          .map((x) => (order.has(x.id) ? { ...x, sortOrder: order.get(x.id)! } : x))
          .sort((a, b) => a.sortOrder - b.sortOrder);
      });

      return { prev };
    },

    onError: (_err, _dto, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.locationMedia.images(locationId), ctx.prev);
    },

    onSuccess: () => {
      
    },
  });
}
