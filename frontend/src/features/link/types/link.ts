export interface Category {
  id: number;
  name: string;
}

export interface LinkRequestDto {
  title?: string;
  url: string;
}

export interface LinkResponseDto {
  id: number;
  title: string;
  url: string;
  thumbnailImageUrl: string;
  price: string;
  previewStatus: PreviewStatus;
}

export interface LinkPreviewDto {
  title: string;
  thumbnailImageUrl: string;
  price: string;
}

export enum PreviewStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
