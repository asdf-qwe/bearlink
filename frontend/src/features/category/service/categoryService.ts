import { Category, CategoryRequest } from "../types/categoryTypes";
import { authService } from "../../auth/service/authService";

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
   */ async createCategory(
    req: CategoryRequest,
    userId: number
  ): Promise<string> {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/category?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키를 포함하여 요청
          body: JSON.stringify(req),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요");
        }
        if (response.status === 403) {
          throw new Error("접근 권한이 없습니다. 관리자에게 문의하세요");
        }
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
   */ async getCategoriesByUserId(userId: number): Promise<Category[]> {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/category?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키를 포함하여 요청
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요");
        }
        if (response.status === 403) {
          throw new Error("접근 권한이 없습니다. 관리자에게 문의하세요");
        }
        throw new Error("카테고리 조회에 실패했습니다");
      }

      return await response.json();
    } catch (error) {
      console.error("카테고리 조회 에러:", error);
      throw error;
    }
  },
  /**
   * 카테고리를 삭제합니다
   * @param categoryId 삭제할 카테고리 ID
   * @returns 삭제 결과 메시지
   */
  async deleteCategory(categoryId: number): Promise<string> {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/category?categoryId=${categoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키를 포함하여 요청
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요");
        }
        if (response.status === 403) {
          throw new Error("접근 권한이 없습니다. 관리자에게 문의하세요");
        }
        throw new Error("카테고리 삭제에 실패했습니다");
      }

      return await response.text();
    } catch (error) {
      console.error("카테고리 삭제 에러:", error);
      throw error;
    }
  },
  /**
   * 카테고리를 수정합니다
   * @param req 수정할 카테고리 요청 DTO (name만 포함)
   * @param categoryId 수정할 카테고리 ID
   * @returns 수정 결과 메시지
   */
  async updateCategory(req: CategoryRequest, categoryId: number): Promise<string> {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/category?categoryId=${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키를 포함하여 요청
          body: JSON.stringify(req),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요");
        }
        if (response.status === 403) {
          throw new Error("접근 권한이 없습니다. 관리자에게 문의하세요");
        }
        throw new Error("카테고리 수정에 실패했습니다");
      }

      return await response.text();
    } catch (error) {
      console.error("카테고리 수정 에러:", error);
      throw error;
    }
  },
};

export default categoryService;
