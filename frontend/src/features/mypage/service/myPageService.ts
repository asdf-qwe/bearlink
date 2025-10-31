import { apiClient } from "@/lib/api";
import { UpdateProfileDto } from "../types/myPage";

class MyPageService {
  /**
   * 프로필 정보 업데이트
   * @param updateData 업데이트할 프로필 정보
   * @returns Promise<string> 성공 메시지
   */
  async updateProfile(updateData: UpdateProfileDto): Promise<string> {
    try {
      const response = await apiClient.request("/api/v1/myPage", {
        method: "PUT",
        body: JSON.stringify(updateData),
        credentials: "include", // 쿠키 인증 추가
      });

      if (!response.ok) {
        throw new Error(`프로필 업데이트 실패: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      throw new Error("프로필 업데이트에 실패했습니다.");
    }
  }

  /**
   * Bio만 업데이트
   * @param bio 새로운 bio
   * @returns Promise<string> 성공 메시지
   */
  async updateBio(bio: string): Promise<string> {
    return this.updateProfile({ bio });
  }

  /**
   * 닉네임만 업데이트
   * @param nickname 새로운 닉네임
   * @returns Promise<string> 성공 메시지
   */
  async updateNickname(nickname: string): Promise<string> {
    return this.updateProfile({ nickname });
  }

  /**
   * 프로필 이미지 파일 업로드 (별도 API)
   * @param file 업로드할 이미지 파일
   * @returns Promise<string> 업로드된 이미지 URL
   */
  async uploadProfileImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.request("/api/v1/profile-image/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // 쿠키 인증 추가
      });

      if (!response.ok) {
        throw new Error(`이미지 업로드 실패: ${response.status}`);
      }

      // 업로드된 이미지 URL 반환
      const result = await response.json();
      return result.imageUrl || result.url || result;
    } catch (error) {
      throw new Error("이미지 업로드에 실패했습니다.");
    }
  }
}

export const myPageService = new MyPageService();
