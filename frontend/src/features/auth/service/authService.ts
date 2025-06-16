import {
  TokenResponseDto,
  LoginRequestDto,
  SignupRequestDto,
  UserResponseDto,
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
   * @returns 사용자 정보 (UserResponseDto)
   */
  async signup(dto: SignupRequestDto): Promise<UserResponseDto> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/signup`, {
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

      const userData: UserResponseDto = await response.json();
      return userData;
    } catch (error) {
      console.error("회원가입 에러:", error);
      throw error;
    }
  },
  /**
   * 로그인 기능
   * @param requestDto 로그인 요청 DTO (로그인 ID, 비밀번호 포함)
   * @returns JWT 토큰 (액세스 토큰, 리프레시 토큰)
   */ async login(requestDto: LoginRequestDto): Promise<TokenResponseDto> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청
        body: JSON.stringify(requestDto),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "로그인에 실패했습니다");
      }

      const tokens: TokenResponseDto = await response.json();
      // 쿠키는 서버에서 자동으로 설정되므로 로컬스토리지 저장 제거

      return tokens;
    } catch (error) {
      console.error("로그인 에러:", error);
      throw error;
    }
  },
  /**
   * 현재 로그인한 사용자 정보 가져오기
   * @returns 사용자 정보 (UserResponseDto)
   */ async getCurrentUser(): Promise<UserResponseDto> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요");
        }
        const errorText = await response.text();
        throw new Error(errorText || "사용자 정보를 가져오는데 실패했습니다");
      }

      const userData: UserResponseDto = await response.json();
      return userData;
    } catch (error) {
      console.error("사용자 정보 조회 에러:", error);
      throw error;
    }
  },
  /**
   * 로그아웃 기능
   */ async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청
      });

      // 서버 응답과 관계없이 로컬 상태 정리
      // 쿠키는 서버에서 삭제되므로 추가 처리 불필요
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
      const response = await fetch(`${API_URL}/api/v1/users/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청
      });

      if (!response.ok) {
        throw new Error("토큰 갱신에 실패했습니다");
      }

      const tokens: TokenResponseDto = await response.json();
      return tokens;
    } catch (error) {
      console.error("토큰 갱신 에러:", error);
      throw error;
    }
  },
  /**
   * 사용자가 로그인 상태인지 확인
   * 서버에 요청하여 실제 인증 상태를 확인
   * @returns 로그인 상태 여부
   */ async isLoggedIn(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청
      });

      return response.ok;
    } catch (error) {
      console.error("로그인 상태 확인 에러:", error);
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
      const response = await fetch(
        `${API_URL}/api/v1/users/check-email?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const message = await response.text();

      if (response.ok) {
        return { available: true, message };
      } else if (response.status === 409) {
        return { available: false, message };
      } else if (response.status === 400) {
        return { available: false, message };
      } else {
        throw new Error(message || "이메일 확인에 실패했습니다");
      }
    } catch (error) {
      console.error("이메일 중복 체크 에러:", error);
      throw error;
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
      const response = await fetch(
        `${API_URL}/api/v1/users/check-loginId?loginId=${encodeURIComponent(
          loginId
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const message = await response.text();

      if (response.ok) {
        return { available: true, message };
      } else if (response.status === 409) {
        return { available: false, message };
      } else {
        throw new Error(message || "로그인 ID 확인에 실패했습니다");
      }
    } catch (error) {
      console.error("로그인 ID 중복 체크 에러:", error);
      throw error;
    }
  },
};

export default authService;
