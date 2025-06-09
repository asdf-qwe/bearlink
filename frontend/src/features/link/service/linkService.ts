import { LinkRequestDto } from '../types/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

class LinkService {
  async createLink(userId: number, linkRequest: LinkRequestDto): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/link?userId=${userId}`, {
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
}

export const linkService = new LinkService();