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
  title: string;
  url: string;
  thumbnailImageUrl: string;
}
