// 백엔드 FriendResponseDto에 대응하는 인터페이스
export interface FriendResponseDto {
  id: number;
  nickname: string;
  imageUrl: string;
}

// 백엔드 FriendRequestDto에 대응하는 인터페이스
export interface FriendRequestDto {
  receiverId: number; // 친구 신청 대상자 ID
}

// 프론트엔드에서 사용할 친구 정보 인터페이스
export interface Friend {
  id: number;
  nickname: string;
  imageUrl?: string;
  isStarred?: boolean;
}

// 친구 신청 정보 인터페이스
export interface FriendRequest {
  id: number;
  nickname: string;
  imageUrl?: string;
  requestedAt?: string;
}
