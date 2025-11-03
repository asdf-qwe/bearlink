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

      // ApiResponse 형태인지 확인하고 처리
      if (response.success !== undefined) {
        const apiResponse = response as ApiResponse<FriendResponseDto[]>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return Array.isArray(apiResponse.data) ? apiResponse.data : [];
      }

      // 기존 형태 호환성 유지
      return Array.isArray(response.data) ? response.data : response || [];
    } catch (error) {
      throw error;
    }
  }

  // 친구 신청 보내기
  async sendFriendRequest(requestData: FriendRequestDto): Promise<string> {
    try {
      if (!requestData.receiverId) {
        throw new Error("receiverId가 필요합니다.");
      }

      const response = await api.post("/api/v1/friend/request", requestData);

      // ApiResponse 형태인지 확인하고 처리
      if (response.success !== undefined) {
        const apiResponse = response as ApiResponse<string>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return apiResponse.message;
      }

      return "친구 신청이 완료되었습니다.";
    } catch (error) {
      console.error("친구 신청 실패:", error);
      throw error;
    }
  }

  // 받은 친구 신청 목록 조회
  async getFriendRequests(): Promise<FriendResponseDto[]> {
    try {
      const response = await api.get("/api/v1/friend/requests");

      // ApiResponse 형태인지 확인하고 처리
      if (response.success !== undefined) {
        const apiResponse = response as ApiResponse<FriendResponseDto[]>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return Array.isArray(apiResponse.data) ? apiResponse.data : [];
      }

      // 기존 형태 호환성 유지
      return Array.isArray(response.data) ? response.data : response || [];
    } catch (error) {
      console.error("친구 신청 목록 조회 실패:", error);
      throw error;
    }
  }

  // 친구 신청 수락
  async acceptFriendRequest(requestId: number): Promise<string> {
    try {
      const response = await api.post(
        `/api/v1/friend/request/${requestId}/accept`
      );

      // ApiResponse 형태인지 확인하고 처리
      if (response.success !== undefined) {
        const apiResponse = response as ApiResponse<string>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return apiResponse.message;
      }

      return "친구 신청을 수락했습니다.";
    } catch (error) {
      console.error("친구 신청 수락 실패:", error);
      throw error;
    }
  }

  // 친구 신청 거절
  async rejectFriendRequest(requestId: number): Promise<string> {
    try {
      const response = await api.post(
        `/api/v1/friend/request/${requestId}/reject`
      );

      // ApiResponse 형태인지 확인하고 처리
      if (response.success !== undefined) {
        const apiResponse = response as ApiResponse<string>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return apiResponse.message;
      }

      return "친구 신청을 거절했습니다.";
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
