/**
 * 백엔드의 RoomLinkDto와 매핑되는 타입
 * 링크룸 내 단일 링크 정보에 사용
 */
export interface RoomLinkDto {
  title: string;
  url: string;
  thumbnailImageUrl: string;
}
/**
 * 백엔드의 RoomMessageDto와 매핑되는 타입
 * 채팅 메시지 및 링크 작업 메시지에 사용
 */
export interface RoomMessageDto {
  roomId: number; // 방 ID
  senderId: number; // 보낸 사람 ID
  senderName: string; // 보낸 사람 이름 or 닉네임
  type: MessageType; // 메시지 타입 (TALK, LINK_ADD 등)
  content: string; // 채팅 내용 or 링크 ID
  // (선택) 링크 작업시 사용할 데이터
  linkTitle?: string;
  linkUrl?: string;
  linkThumbnail?: string;
}

/**
 * 메시지 타입 (ENTER, TALK, LEAVE, LINK_ADD, LINK_DELETE, LINK_UPDATE)
 */
export type MessageType =
  | "ENTER"
  | "TALK"
  | "LEAVE"
  | "LINK_ADD"
  | "LINK_DELETE"
  | "LINK_UPDATE";
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
 * 백엔드의 InviteFriendWithStatusResponse 레코드와 매핑되는 인터페이스
 * 친구 초대 시 상태 정보를 포함하는 응답
 *
 * NOT_INVITED: 아직 초대되지 않음
 * INVITED: 초대됨 (아직 응답 없음)
 * ACCEPTED: 초대 수락됨
 * DECLINED: 초대 거절됨
 */
export interface InviteFriendWithStatusResponse {
  userId: number;
  nickname: string;
  email: string;
  invitationStatus: string; // NOT_INVITED, INVITED, ACCEPTED, DECLINED
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

/**
 * 백엔드의 RoomInviteList DTO와 매핑되는 인터페이스
 * 링크룸 초대 목록 조회 시 사용
 */
export interface RoomInviteListDto {
  id: number;
  nickname: string;
  imageUrl: string | null;
  status: InvitationStatus;
}

/**
 * 백엔드의 InvitationResponse 레코드와 매핑되는 인터페이스
 * 초대 응답 정보를 나타냄
 */
export interface InvitationResponse {
  roomMemberId: number;
  roomId: number;
}

/**
 * 백엔드의 InvitationStatus enum과 매핑되는 타입
 * 링크룸 초대 상태를 나타냄
 *
 * INVITED: 초대됨 (아직 응답 없음)
 * ACCEPTED: 초대 수락됨
 * DECLINED: 초대 거절됨
 */
export enum InvitationStatus {
  INVITED = "INVITED",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

/**
 * 백엔드의 RoomMemberList 레코드와 매핑되는 인터페이스
 * 링크룸 멤버 목록 조회 시 사용
 */
export interface RoomMemberList {
  userId: number;
  nickname: string;
}
