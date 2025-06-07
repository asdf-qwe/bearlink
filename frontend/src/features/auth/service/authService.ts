import {
  JwtResponseDto,
  LoginRequestDto,
  SignupRequestDto,
} from "../types/auth";

// API 기본 URL - 환경에 맞게 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const AUTH_API = `${API_URL}/api/v1/auth`;

/**
 * 인증 관련 서비스
 */
export const authService = {
  /**
   * 회원가입 기능
   * @param dto 회원가입 요청 DTO (이메일, 비밀번호, 닉네임 포함)
   * @returns 성공 메시지
   */
  async signup(dto: SignupRequestDto): Promise<string> {
    try {
      const response = await fetch(`${AUTH_API}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "회원가입에 실패했습니다");
      }

      return await response.text();
    } catch (error) {
      console.error("회원가입 에러:", error);
      throw error;
    }
  },

  /**
   * 로그인 기능
   * @param requestDto 로그인 요청 DTO (이메일, 비밀번호 포함)
   * @returns JWT 토큰 (액세스 토큰, 리프레시 토큰)
   */
  async login(requestDto: LoginRequestDto): Promise<JwtResponseDto> {
    try {
      const response = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestDto),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "로그인에 실패했습니다");
      }

      const tokens: JwtResponseDto = await response.json();

      // 토큰을 로컬 스토리지에 저장 (필요에 따라 조정)
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      return tokens;
    } catch (error) {
      console.error("로그인 에러:", error);
      throw error;
    }
  },

  /**
   * 현재 로그인한 사용자 정보 가져오기
   * @returns 사용자 정보 (현재는 환영 메시지만 반환)
   */
  async getCurrentUser(): Promise<string> {
    try {
      // 로컬 스토리지에서 액세스 토큰 가져오기
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("로그인이 필요합니다");
      }

      const response = await fetch(`${AUTH_API}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // 토큰이 만료된 경우 등
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요");
        }
        const errorText = await response.text();
        throw new Error(errorText || "사용자 정보를 가져오는데 실패했습니다");
      }

      return await response.text();
    } catch (error) {
      console.error("사용자 정보 조회 에러:", error);
      throw error;
    }
  },

  /**
   * 로그아웃 기능
   */
  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // 필요에 따라 추가 로직 구현 (예: 서버에 로그아웃 알림 등)
  },

  /**
   * 사용자가 로그인 상태인지 확인
   * @returns 로그인 상태 여부
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem("accessToken");
  },
};

export default authService;
