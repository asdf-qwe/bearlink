import { LinkRequestDto, LinkResponseDto, LinkUpdateDto } from "../types/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

class LinkService {
  async createLink(
    userId: number,
    categoryId: number,
    linkRequest: LinkRequestDto
  ): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/link?userId=${userId}&categoryId=${categoryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(linkRequest),
          credentials: "include", // ✅ 쿠키 포함
        }
      );

      if (!response.ok) {
        throw new Error(`링크 생성 실패: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error("링크 생성 중 오류:", error);
      throw error;
    }
  }

  async getLinks(
    userId: number,
    categoryId: number
  ): Promise<LinkResponseDto[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/link?userId=${userId}&categoryId=${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ 쿠키 포함
        }
      );

      if (!response.ok) {
        throw new Error(`링크 조회 실패: ${response.status}`);
      }

      const result = await response.json();
      console.log("백엔드에서 받은 링크 데이터:", result);

      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("링크 조회 중 오류:", error);
      throw error;
    }
  }

  async updateTitle(linkId: number, updateDto: LinkUpdateDto): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/link?linkId=${linkId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateDto),
          credentials: "include", // ✅ 쿠키 포함
        }
      );

      if (!response.ok) {
        throw new Error(`링크 제목 수정 실패: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error("링크 제목 수정 중 오류:", error);
      throw error;
    }
  }

  async deleteLink(linkId: number): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/link?linkId=${linkId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ 쿠키 포함
        }
      );

      if (!response.ok) {
        throw new Error(`링크 삭제 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("링크 삭제 중 오류:", error);
      throw error;
    }
  }

  async getYoutubeVideoIds(categoryId: number): Promise<string[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/link/youtube-ids/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ 쿠키 포함
        }
      );

      if (!response.ok) {
        throw new Error(`YouTube 비디오 ID 조회 실패: ${response.status}`);
      }

      const videoIds: string[] = await response.json();
      console.log("백엔드에서 받은 YouTube 비디오 ID:", videoIds);

      return Array.isArray(videoIds) ? videoIds : [];
    } catch (error) {
      console.error("YouTube 비디오 ID 조회 중 오류:", error);
      throw error;
    }
  }
}

export const linkService = new LinkService();
