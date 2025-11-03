// 링크룸 채팅 및 링크 관련 API 서비스
import axios from "axios";
import { RoomLinkDto, RoomMessageDto } from "../type/room";

const BASE_URL = "/api/rooms";

/**
 * 링크 추가
 */
export async function addLink(
  roomId: number,
  dto: RoomLinkDto
): Promise<number> {
  const res = await axios.post(`${BASE_URL}/${roomId}/links`, dto);

  // ApiResponse 형태인지 확인하고 처리
  if (res.data && res.data.success !== undefined) {
    const apiResponse = res.data as ApiResponse<number>;
    if (!apiResponse.success) {
      throw new Error(apiResponse.message);
    }
    return apiResponse.data; // saved link id
  }

  return res.data; // saved link id
}

/**
 * 링크 수정
 */
export async function updateLink(
  roomId: number,
  linkId: number,
  dto: RoomLinkDto
): Promise<string> {
  const res = await axios.put(`${BASE_URL}/${roomId}/links/${linkId}`, dto);

  // ApiResponse 형태인지 확인하고 처리
  if (res.data && res.data.success !== undefined) {
    const apiResponse = res.data as ApiResponse<string>;
    if (!apiResponse.success) {
      throw new Error(apiResponse.message);
    }
    return apiResponse.message;
  }

  return "링크가 수정되었습니다.";
}

/**
 * 링크 삭제
 */
export async function deleteLink(
  roomId: number,
  linkId: number
): Promise<string> {
  const res = await axios.delete(`${BASE_URL}/${roomId}/links/${linkId}`);

  // ApiResponse 형태인지 확인하고 처리
  if (res.data && res.data.success !== undefined) {
    const apiResponse = res.data as ApiResponse<string>;
    if (!apiResponse.success) {
      throw new Error(apiResponse.message);
    }
    return apiResponse.message;
  }

  return "링크가 삭제되었습니다.";
}
