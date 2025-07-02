import { api } from "@/lib/api";
import {
  FriendResponseDto,
  FriendRequestDto,
  Friend,
  FriendRequest,
  FindFriendDto,
} from "../types/friend";

class FriendService {
  // 친구 목록 조회
  async getFriends(): Promise<FriendResponseDto[]> {
    try {
      const response = await api.get("/api/v1/friend");
      return Array.isArray(response.data) ? response.data : response || [];
    } catch (error) {
      console.error("친구 목록 조회 실패:", error);
      throw error;
    }
  }

  // 친구 신청 보내기
  async sendFriendRequest(requestData: FriendRequestDto): Promise<void> {
    try {
      console.log("친구 신청 요청 데이터:", requestData);
      console.log("receiverId:", requestData.receiverId);

      if (!requestData.receiverId) {
        throw new Error("receiverId가 필요합니다.");
      }

      await api.post("/api/v1/friend/request", requestData);
    } catch (error) {
      console.error("친구 신청 실패:", error);
      throw error;
    }
  }

  // 받은 친구 신청 목록 조회
  async getFriendRequests(): Promise<FriendResponseDto[]> {
    try {
      const response = await api.get("/api/v1/friend/requests");
      return Array.isArray(response.data) ? response.data : response || [];
    } catch (error) {
      console.error("친구 신청 목록 조회 실패:", error);
      throw error;
    }
  }

  // 친구 신청 수락
  async acceptFriendRequest(requestId: number): Promise<void> {
    try {
      await api.post(`/api/v1/friend/request/${requestId}/accept`);
    } catch (error) {
      console.error("친구 신청 수락 실패:", error);
      throw error;
    }
  }

  // 친구 신청 거절
  async rejectFriendRequest(requestId: number): Promise<void> {
    try {
      await api.post(`/api/v1/friend/request/${requestId}/reject`);
    } catch (error) {
      console.error("친구 신청 거절 실패:", error);
      throw error;
    }
  }

  // 친구 검색
  async findFriends(
    keyword: string,
    page: number = 0,
    size: number = 10
  ): Promise<{
    content: FindFriendDto[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> {
    try {
      const response = await api.get("/api/v1/friend/find-friend", {
        params: { keyword, page, size },
      });

      console.log("친구 검색 API 원본 응답:", response);

      // 백엔드에서 이미 필터링된 결과만 반환하므로 모든 결과를 그대로 사용
      const content = Array.isArray(response?.content)
        ? response.content
        : Array.isArray(response)
        ? response
        : [];

      return {
        content,
        totalElements: response?.totalElements || content.length,
        totalPages: response?.totalPages || 1,
        number: response?.number || 0,
        size: response?.size || size,
      };
    } catch (error) {
      console.error("친구 검색 실패:", error);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 0,
      };
    }
  }

  // 백엔드 DTO를 프론트엔드 Friend 인터페이스로 변환
  convertToFriend(friendDto: FriendResponseDto): Friend {
    return {
      id: friendDto.id,
      nickname: friendDto.nickname,
      imageUrl: friendDto.imageUrl,
      isStarred: false, // 기본값
    };
  }

  // 백엔드 DTO를 프론트엔드 FriendRequest 인터페이스로 변환
  convertToFriendRequest(friendDto: FriendResponseDto): FriendRequest {
    return {
      id: friendDto.id,
      nickname: friendDto.nickname,
      imageUrl: friendDto.imageUrl,
    };
  }
}

export const friendService = new FriendService();
