/**
 * 프로필 업데이트 요청 DTO - 백엔드의 UpdateProfileDto 클래스와 매핑됨
 * 이미지 업로드는 별도 API로 처리
 *
 * @interface UpdateProfileDto
 * @property {string} [nickname] - 사용자 닉네임 (선택사항)
 * @property {string} [bio] - 사용자 소개 (선택사항)
 */
export interface UpdateProfileDto {
  nickname?: string;
  bio?: string;
}
