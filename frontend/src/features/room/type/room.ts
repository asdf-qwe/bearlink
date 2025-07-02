export interface CreateLinkRoomRequest {
  name: string;
}

export interface CreateLinkRoomResponse {
  roomId: number;
  name: string;
}

export interface RoomInviteRequest {
  userId: number;
}

export interface RoomsDto {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: number;
}

/**
 * 백엔드의 RoomLinkListDto와 매핑되는 인터페이스
 * 링크룸 내 링크 목록 조회 시 사용
 */
export interface RoomLinkListDto {
  id: number;
  title: string;
  url: string;
  thumbnailImageUrl?: string;
}
