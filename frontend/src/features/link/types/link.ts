export interface Category {
  id: number;
  name: string;
}

export interface LinkRequestDto {
  title: string;
  url: string;
  thumbnailImageUrl: string;
}

export interface LinkResponseDto {
  id: number;
  title: string;
  url: string;
  thumbnailImageUrl: string;
}

export interface LinkPreviewDto {
  title: string;
  thumbnailImageUrl: string;
}
