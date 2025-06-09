import { LinkRequestDto, LinkResponseDto } from '../types/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

class LinkService {
  async createLink(userId: number, categoryId: number, linkRequest: LinkRequestDto): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/link?userId=${userId}&categoryId=${categoryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkRequest),
      });

      if (!response.ok) {
        throw new Error(`링크 생성 실패: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('링크 생성 중 오류:', error);
      throw error;
    }
  }
  async getLinks(userId: number, categoryId: number): Promise<LinkResponseDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/link?userId=${userId}&categoryId=${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`링크 조회 실패: ${response.status}`);
      }      const result = await response.json();
      console.log('백엔드에서 받은 링크 데이터:', result);
      // 결과가 배열이 아닌 경우 빈 배열 반환
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('링크 조회 중 오류:', error);
      throw error;
    }
  }
}

export const linkService = new LinkService();