import {
  TokenResponseDto,
  LoginRequestDto,
  SignupRequestDto,
  UserResponseDto,
} from "../types/auth";
import { apiClient } from "../../../lib/api";

/**
 * 인증 관련 서비스
 */
export const authService = {
  /**
   * 회원가입 기능
   * @param dto 회원가입 요청 DTO (이메일, 비밀번호, 닉네임 포함)
   * @returns 사용자 정보 (UserResponseDto)
   */
  async signup(dto: SignupRequestDto): Promise<UserResponseDto> {
    try {
      const result: ApiResponse<UserResponseDto> = await apiClient.post(
        "/api/v1/users/signup",
        dto
      );
      return result.data;
    } catch (error) {
      console.error("회원가입 에러:", error);
      throw error;
    }
  },

  /**
   * 로그인 기능
   * @param requestDto 로그인 요청 DTO (로그인 ID, 비밀번호 포함)
   * @returns JWT 토큰 (액세스 토큰, 리프레시 토큰)
   */
  async login(requestDto: LoginRequestDto): Promise<TokenResponseDto> {
    try {
      const result: ApiResponse<TokenResponseDto> = await apiClient.post(
        "/api/v1/users/login",
        requestDto
      );
      return result.data;
    } catch (error) {
      console.error("로그인 에러:", error);
      throw error;
    }
  },

  /**
   * 현재 로그인한 사용자 정보 가져오기 (자동 토큰 갱신 포함)
   * @returns 사용자 정보 (UserResponseDto)
   */
  async getCurrentUser(): Promise<UserResponseDto> {
    try {
      const result: ApiResponse<UserResponseDto> = await apiClient.get(
        "/api/v1/users/me"
      );
      return result.data;
    } catch (error) {
      // 로그인하지 않은 상태에서는 정상적인 에러이므로 조용히 처리
      // console.error("사용자 정보 조회 에러:", error);
      throw error;
    }
  },

  /**
   * 로그아웃 기능
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/v1/users/logout");
    } catch (error) {
      console.error("로그아웃 에러:", error);
      // 에러가 발생해도 로그아웃 처리를 진행
    }
  },

  /**
   * AccessToken 재발급
   * @returns 새로운 JWT 토큰
   */
  async refreshToken(): Promise<TokenResponseDto> {
    try {
      const result: ApiResponse<TokenResponseDto> = await apiClient.post(
        "/api/v1/users/refresh"
      );
      return result.data;
    } catch (error) {
      console.error("토큰 갱신 에러:", error);
      throw error;
    }
  },

  /**
   * 사용자가 로그인 상태인지 확인 (토큰 자동 갱신 포함)
   * 서버에 요청하여 실제 인증 상태를 확인
   * @returns 로그인 상태 여부
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      // 홈페이지에서 로그인 상태 확인은 정상적인 동작이므로 조용히 처리
      // console.error("로그인 상태 확인 에러:", error);
      return false;
    }
  },

  /**
   * 이메일 중복 체크
   * @param email 확인할 이메일 주소
   * @returns 이메일 사용 가능 여부와 메시지
   */
  async checkEmail(
    email: string
  ): Promise<{ available: boolean; message: string }> {
    try {
      const result: ApiResponse<string> = await apiClient.get(
        "/api/v1/users/check-email",
        { params: { email } }
      );
      return { available: true, message: result.message };
    } catch (error) {
      console.error("이메일 중복 체크 에러:", error);
      if (error instanceof Error) {
        return { available: false, message: error.message };
      }
      return { available: false, message: "이메일 확인에 실패했습니다" };
    }
  },

  /**
   * 로그인 ID 중복 체크
   * @param loginId 확인할 로그인 ID
   * @returns 로그인 ID 사용 가능 여부와 메시지
   */
  async checkLoginId(
    loginId: string
  ): Promise<{ available: boolean; message: string }> {
    try {
      const result: ApiResponse<string> = await apiClient.get(
        "/api/v1/users/check-loginId",
        { params: { loginId } }
      );
      return { available: true, message: result.message };
    } catch (error) {
      console.error("로그인 ID 중복 체크 에러:", error);
      if (error instanceof Error) {
        return { available: false, message: error.message };
      }
      return { available: false, message: "로그인 ID 확인에 실패했습니다" };
    }
  },
};

export default authService;
