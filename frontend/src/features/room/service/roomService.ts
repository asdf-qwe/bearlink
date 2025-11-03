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
  deleteRoom: async (roomId: number): Promise<string> => {
    try {
      const response = await api.delete(`/api/v1/room?roomId=${roomId}`);

      // ApiResponse 형태인지 확인하고 처리
      if (response && response.success !== undefined) {
        const apiResponse = response as ApiResponse<string>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return apiResponse.message;
      }

      return "방이 삭제되었습니다.";
    } catch (error) {
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

      // ApiResponse 형태인지 확인하고 처리
      if (response && response.success !== undefined) {
        const apiResponse = response as ApiResponse<CreateLinkRoomResponse>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return apiResponse.data;
      }

      return response as CreateLinkRoomResponse;
    } catch (error) {
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
  async inviteUser(roomId: number, userId: number): Promise<string> {
    try {
      const request: RoomInviteRequest = { userId };
      const response = await api.post(`/api/v1/room/${roomId}/invite`, request);

      // ApiResponse 형태인지 확인하고 처리
      if (response && response.success !== undefined) {
        const apiResponse = response as ApiResponse<string>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return apiResponse.message;
      }

      return "초대가 완료되었습니다.";
    } catch (error) {
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

      // ApiResponse 형태인지 확인하고 처리
      if (response && response.success !== undefined) {
        const apiResponse = response as ApiResponse<RoomsDto[]>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return Array.isArray(apiResponse.data) ? apiResponse.data : [];
      }

      return response as RoomsDto[];
    } catch (error) {
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

      // ApiResponse 형태인지 확인하고 처리
      if (response && response.success !== undefined) {
        const apiResponse = response as ApiResponse<RoomsDto>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return apiResponse.data;
      }

      return response as RoomsDto;
    } catch (error) {
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
  async acceptInvitation(roomMemberId: number): Promise<string> {
    try {
      const response = await api.post(
        `/api/v1/room/invitations/${roomMemberId}/accept`
      );

      // ApiResponse 형태인지 확인하고 처리
      if (response && response.success !== undefined) {
        const apiResponse = response as ApiResponse<string>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return apiResponse.message;
      }

      return "초대를 수락했습니다.";
    } catch (error) {
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
  async declineInvitation(roomMemberId: number): Promise<string> {
    try {
      const response = await api.post(
        `/api/v1/room/invitations/${roomMemberId}/decline`
      );

      // ApiResponse 형태인지 확인하고 처리
      if (response && response.success !== undefined) {
        const apiResponse = response as ApiResponse<string>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return apiResponse.message;
      }

      return "초대를 거절했습니다.";
    } catch (error) {
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
      const response = await api.get(`/api/v1/room/${roomId}/members`);

      // ApiResponse 형태인지 확인하고 처리
      if (response && response.success !== undefined) {
        const apiResponse = response as ApiResponse<RoomMemberList[]>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return Array.isArray(apiResponse.data) ? apiResponse.data : [];
      }

      if (Array.isArray(response)) {
        return response as RoomMemberList[];
      } else {
        return [];
      }
    } catch (error) {
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

      // ApiResponse 형태인지 확인하고 처리
      if (response && response.success !== undefined) {
        const apiResponse = response as ApiResponse<RoomLinkListDto[]>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return Array.isArray(apiResponse.data) ? apiResponse.data : [];
      }

      return response as RoomLinkListDto[];
    } catch (error) {
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
      // 캐시를 무시하고 최신 데이터를 가져오기 위한 랜덤 쿼리 파라미터 추가
      const timestamp = new Date().getTime();
      const response = await api.get(
        `/api/v1/room/${roomId}/invite-friends?_t=${timestamp}`
      );

      // ApiResponse 형태인지 확인하고 처리
      if (response && response.success !== undefined) {
        const apiResponse = response as ApiResponse<
          InviteFriendWithStatusResponse[]
        >;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return Array.isArray(apiResponse.data) ? apiResponse.data : [];
      }

      // 응답 데이터가 유효한지 확인
      if (Array.isArray(response)) {
        return response as InviteFriendWithStatusResponse[];
      } else {
        return [];
      }
    } catch (error) {
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
      const response = await api.get("/api/v1/room/invitations");

      // ApiResponse 형태인지 확인하고 처리
      if (response && response.success !== undefined) {
        const apiResponse = response as ApiResponse<InvitationResponse[]>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return Array.isArray(apiResponse.data) ? apiResponse.data : [];
      }

      // 응답 형식 검증
      if (Array.isArray(response)) {
        return response as InvitationResponse[];
      } else {
        return [];
      }
    } catch (error: any) {
      throw error;
    }
  },
};

// 편의를 위한 alias
export default roomService;
