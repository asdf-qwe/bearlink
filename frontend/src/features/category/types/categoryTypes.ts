// 카테고리 응답 타입 정의
export interface Category {
  id: number;
  name: string;
  userId: number;
  // 필요한 다른 필드가 있다면 여기에 추가
}

// 카테고리 생성 요청 DTO
export interface CategoryRequest {
  name: string;
}
