import { api } from "../../../lib/api";
import {
  CreateLinkRoomRequest,
  CreateLinkRoomResponse,
  RoomInviteRequest,
  RoomsDto,
  RoomLinkListDto,
} from "../type/room";
import { RoomMember } from "../type/roomPageTypes";

/**
 * 링크룸 관련 API 서비스
 * 서버의 /api/v1/room 엔드포인트와 통신
 */
export const roomService = {
  /**
   * 새로운 링크룸 생성
   *
   * @param request 방 생성 요청 정보
   * @returns 생성된 방 정보
   */
  async createRoom(
    request: CreateLinkRoomRequest
  ): Promise<CreateLinkRoomResponse> {
    try {
      // Content-Type을 application/json으로 명시적으로 설정
      const options = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await api.post("/api/v1/room", request, options);
      return response as CreateLinkRoomResponse;
    } catch (error) {
      console.error("링크룸 생성 실패:", error);
      throw error;
    }
  },

  /**
   * 사용자를 링크룸에 초대
   * 서버 엔드포인트: POST /api/v1/room/{roomId}/invite
   *
   * @param roomId 초대할 방 ID
   * @param userId 초대할 사용자 ID
   * @returns 초대 결과
   */
  async inviteUser(roomId: number, userId: number): Promise<void> {
    try {
      const request: RoomInviteRequest = { userId };
      await api.post(`/api/v1/room/${roomId}/invite`, request);
    } catch (error) {
      console.error("링크룸 초대 실패:", error);
      throw error;
    }
  },

  /**
   * 현재 사용자의 모든 링크룸 목록 조회
   * 서버 엔드포인트: GET /api/v1/room
   *
   * @returns 링크룸 목록
   */
  async getRooms(): Promise<RoomsDto[]> {
    try {
      const response = await api.get("/api/v1/room");
      return response as RoomsDto[];
    } catch (error) {
      console.error("링크룸 목록 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 특정 링크룸 조회
   * 주의: 실제 API 없음 - 대신 getRoomLinks를 통해 링크룸 정보와 링크 목록을 함께 조회
   *
   * @param roomId 조회할 방 ID
   * @returns 링크룸 정보
   * @deprecated 이 메서드는 더 이상 사용되지 않습니다. getRoomLinks를 통해 링크룸 정보를 함께 조회하세요.
   */
  async getRoomById(roomId: number): Promise<RoomsDto> {
    try {
      // 실제 구현에서는 getRoomLinks 호출 결과에서 방 정보를 추출하거나
      // 다른 방식으로 방 정보를 얻어야 합니다.
      // 임시로 최소한의 정보만 반환
      return { id: roomId, name: `링크룸 ${roomId}` } as RoomsDto;
    } catch (error) {
      console.error(`링크룸(ID: ${roomId}) 조회 실패:`, error);
      throw error;
    }
  },

  /**
   * 링크룸 초대 수락
   * 서버 엔드포인트: POST /api/v1/room/invitations/{roomMemberId}/accept
   *
   * @param roomMemberId 수락할 초대의 room member ID
   * @returns void
   */
  async acceptInvitation(roomMemberId: number): Promise<void> {
    try {
      await api.post(`/api/v1/room/invitations/${roomMemberId}/accept`);
    } catch (error) {
      console.error(`링크룸 초대 수락 실패 (ID: ${roomMemberId}):`, error);
      throw error;
    }
  },

  /**
   * 링크룸 초대 거절
   * 서버 엔드포인트: POST /api/v1/room/invitations/{roomMemberId}/decline
   *
   * @param roomMemberId 거절할 초대의 room member ID
   * @returns void
   */
  async declineInvitation(roomMemberId: number): Promise<void> {
    try {
      await api.post(`/api/v1/room/invitations/${roomMemberId}/decline`);
    } catch (error) {
      console.error(`링크룸 초대 거절 실패 (ID: ${roomMemberId}):`, error);
      throw error;
    }
  },

  /**
   * 링크룸 멤버 목록 조회
   * 서버 엔드포인트: GET /api/v1/room/{roomId}/members
   *
   * @param roomId 조회할 방 ID
   * @returns 링크룸 멤버 목록
   */
  async getRoomMembers(roomId: number): Promise<RoomMember[]> {
    try {
      const response = await api.get(`/api/v1/room/${roomId}/members`);
      return response as RoomMember[];
    } catch (error) {
      console.error(`링크룸(ID: ${roomId}) 멤버 조회 실패:`, error);
      throw error;
    }
  },

  /**
   * 링크룸에 속한 링크 목록 조회
   * 서버 엔드포인트: GET /api/v1/room/links?roomId={roomId}
   *
   * @param roomId 조회할 방 ID
   * @returns 링크룸의 링크 목록
   */
  async getRoomLinks(roomId: number): Promise<RoomLinkListDto[]> {
    try {
      const response = await api.get(`/api/v1/room/links?roomId=${roomId}`);
      return response as RoomLinkListDto[];
    } catch (error) {
      console.error(`링크룸(ID: ${roomId}) 링크 목록 조회 실패:`, error);
      throw error;
    }
  },
};

// 편의를 위한 alias
export default roomService;
