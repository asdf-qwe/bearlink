/**
 * JWT 응답 DTO - 백엔드의 JwtResponseDto 클래스와 매핑됨
 *
 * @interface JwtResponseDto
 * @property {string} accessToken - 액세스 토큰
 * @property {string} refreshToken - 리프레시 토큰
 */
export interface JwtResponseDto {
  accessToken: string;
  refreshToken: string;
}

/**
 * 로그인 요청 DTO - 백엔드의 LoginRequestDto 클래스와 매핑됨
 *
 * @interface LoginRequestDto
 * @property {string} email - 사용자 이메일
 * @property {string} password - 사용자 비밀번호
 */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/**
 * 회원가입 요청 DTO - 백엔드의 SignupRequestDto 클래스와 매핑됨
 *
 * @interface SignupRequestDto
 * @property {string} email - 사용자 이메일
 * @property {string} password - 사용자 비밀번호
 * @property {string} nickname - 사용자 닉네임
 */
export interface SignupRequestDto {
  email: string;
  password: string;
  nickname: string;
}

/**
 * 사용자 응답 DTO - 백엔드의 UserResponseDto 클래스와 매핑됨
 *
 * @interface UserResponseDto
 * @property {number} id - 사용자 ID
 * @property {string} nickname - 사용자 닉네임
 * @property {string} email - 사용자 이메일
 */
export interface UserResponseDto {
  id: number;
  nickname: string;
  email: string;
}
