export type LocationMediaItem = {
  id: string;
  url: string;
  thumbUrl: string | null;
  sortOrder: number;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
};

export type UpdateLocationImagesOrderItemDto = {
  id: string;
  sortOrder: number;
};

export type UpdateLocationImagesOrderDto = {
  items: UpdateLocationImagesOrderItemDto[];
};
