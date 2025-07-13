import { api } from "../../../lib/api";
import {
  CreateLinkRoomRequest,
  CreateLinkRoomResponse,
  RoomInviteRequest,
  RoomsDto,
  RoomLinkListDto,
  RoomInviteListDto,
  InvitationStatus,
  InvitationResponse,
  InviteFriendWithStatusResponse,
  RoomMemberList,
} from "../type/room";
import { RoomMember } from "../type/roomPageTypes";

/**
 * 링크룸 관련 API 서비스
 * 서버의 /api/v1/room 엔드포인트와 통신
 */
export const roomService = {
  /**
   * 링크룸 삭제
   * 서버 엔드포인트: DELETE /api/v1/room?roomId={roomId}
   *
   * @param roomId 삭제할 방 ID
   * @returns void
   */
  deleteRoom: async (roomId: number): Promise<void> => {
    try {
      await api.delete(`/api/v1/room?roomId=${roomId}`);
    } catch (error) {
      console.error(`링크룸(ID: ${roomId}) 삭제 실패:`, error);
      throw error;
    }
  },
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
   * 특정 링크룸 조회 (실제 API 연동)
   * 서버 엔드포인트: GET /api/v1/room/{roomId}
   *
   * @param roomId 조회할 방 ID
   * @returns 링크룸 정보
   */
  async getRoomById(roomId: number): Promise<RoomsDto> {
    try {
      const response = await api.get(`/api/v1/room/${roomId}`);
      return response as RoomsDto;
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
   * @returns 링크룸 멤버 목록 (RoomMemberList[] 타입)
   */
  async getMembers(roomId: number): Promise<RoomMemberList[]> {
    try {
      console.log(`API 호출: /api/v1/room/${roomId}/members`);
      const response = await api.get(`/api/v1/room/${roomId}/members`);

      if (Array.isArray(response)) {
        console.log(`링크룸(ID: ${roomId}) 멤버 ${response.length}명 조회됨`);
        return response as RoomMemberList[];
      } else {
        console.warn("API가 예상과 다른 형식으로 응답함:", response);
        return [];
      }
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

  /**
   * 초대 가능한 친구 목록 조회 (상태 포함)
   * 서버 엔드포인트: GET /api/v1/room/{roomId}/invite-friends
   *
   * @param roomId 조회할 방 ID
   * @returns 초대할 수 있는 친구 목록 (상태 정보 포함)
   */
  async getInvitableFriends(
    roomId: number
  ): Promise<InviteFriendWithStatusResponse[]> {
    try {
      console.log(`API 호출: /api/v1/room/${roomId}/invite-friends`);
      // 캐시를 무시하고 최신 데이터를 가져오기 위한 랜덤 쿼리 파라미터 추가
      const timestamp = new Date().getTime();
      const response = await api.get(
        `/api/v1/room/${roomId}/invite-friends?_t=${timestamp}`
      );
      console.log("API 응답:", response);

      // 응답 데이터가 유효한지 확인
      if (Array.isArray(response)) {
        // 로그를 통해 각 친구의 상태 확인
        response.forEach((friend) => {
          console.log(
            `친구 ${friend.nickname}(ID: ${friend.userId})의 초대 상태: ${friend.invitationStatus}`
          );
        });
        return response as InviteFriendWithStatusResponse[];
      } else {
        console.warn("API가 예상과 다른 형식으로 응답함:", response);
        return [];
      }
    } catch (error) {
      console.error("초대 가능한 친구 목록 조회 실패:", error);
      throw error; // 에러를 그대로 전달하여 호출한 쪽에서 처리하도록 함
    }
  },

  /**
   * 사용자가 받은 초대 목록 조회
   * 서버 엔드포인트: GET /api/v1/room/invitations
   *
   * @returns 사용자가 받은 초대 목록 (InvitationResponse 배열)
   */
  async getMyInvitations(): Promise<InvitationResponse[]> {
    try {
      console.log("API 호출: /api/v1/room/invitations");
      const response = await api.get("/api/v1/room/invitations");
      console.log("받은 초대 목록 응답:", response);

      // 응답 형식 검증
      if (Array.isArray(response)) {
        console.log(`받은 초대 ${response.length}개 성공적으로 조회됨`);
        // 응답 데이터 구조 검증
        response.forEach((item, index) => {
          if (!item.roomMemberId || !item.roomId) {
            console.warn(`초대 항목 #${index}에 필요한 필드가 누락됨:`, item);
          }
        });
        return response as InvitationResponse[];
      } else {
        console.warn("API가 예상과 다른 형식으로 응답함:", response);
        return [];
      }
    } catch (error: any) {
      // 자세한 에러 정보 출력
      console.error("초대 목록 조회 실패:", error);
      console.error("에러 상태 코드:", error?.response?.status);
      console.error("에러 상세 정보:", error?.response?.data);
      if (error?.response?.status === 500) {
        console.error(
          "서버 내부 오류가 발생했습니다. 백엔드 로그를 확인하세요."
        );
      }
      throw error;
    }
  },
};

// 편의를 위한 alias
export default roomService;
