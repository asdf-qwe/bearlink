import { Category, CategoryRequest } from "../types/categoryTypes";

// API 기본 URL - 환경에 맞게 설정해야 합니다
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * 카테고리 관련 서비스
 */
export const categoryService = {
  /**
   * 새로운 카테고리를 생성합니다
   * @param req 카테고리 요청 DTO (name만 포함)
   * @param userId 사용자 ID
   * @returns 생성 결과 메시지
   */
  async createCategory(req: CategoryRequest, userId: number): Promise<string> {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/category?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        }
      );

      if (!response.ok) {
        throw new Error("카테고리 생성에 실패했습니다");
      }

      return await response.text();
    } catch (error) {
      console.error("카테고리 생성 에러:", error);
      throw error;
    }
  },

  /**
   * 사용자 ID에 해당하는 모든 카테고리를 조회합니다
   * @param userId 사용자 ID
   * @returns 카테고리 목록
   */
  async getCategoriesByUserId(userId: number): Promise<Category[]> {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/category?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("카테고리 조회에 실패했습니다");
      }

      return await response.json();
    } catch (error) {
      console.error("카테고리 조회 에러:", error);
      throw error;
    }
  },
};

export default categoryService;
