// 링크룸 채팅 및 링크 관련 API 서비스
import axios from "axios";
import { RoomLinkDto, RoomMessageDto } from "../type/room";

const BASE_URL = "/api/rooms";

/**
 * 링크 추가
 */
export async function addLink(roomId: number, dto: RoomLinkDto): Promise<number> {
  const res = await axios.post(`${BASE_URL}/${roomId}/links`, dto);
  return res.data; // saved link id
}

/**
 * 링크 수정
 */
export async function updateLink(roomId: number, linkId: number, dto: RoomLinkDto): Promise<void> {
  await axios.put(`${BASE_URL}/${roomId}/links/${linkId}`, dto);
}

/**
 * 링크 삭제
 */
export async function deleteLink(roomId: number, linkId: number): Promise<void> {
  await axios.delete(`${BASE_URL}/${roomId}/links/${linkId}`);
}
