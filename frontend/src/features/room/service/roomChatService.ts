/**
 * 링크룸 내 링크 목록 조회 (REST)
 * @param roomId 채팅방 ID
 * @returns RoomLinkListDto[]
 */
export async function getLinks(
  roomId: number
): Promise<import("../type/room").RoomLinkListDto[]> {
  const res = await axios.get(`${BASE_URL}/${roomId}/links`, {
    withCredentials: true,
  });

  // ApiResponse 형태인지 확인하고 처리
  if (res.data && res.data.success !== undefined) {
    const apiResponse = res.data as ApiResponse<
      import("../type/room").RoomLinkListDto[]
    >;
    if (!apiResponse.success) {
      throw new Error(apiResponse.message);
    }
    return Array.isArray(apiResponse.data) ? apiResponse.data : [];
  }

  return res.data;
}
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { RoomLinkDto, RoomMessageDto } from "../type/room";

const SOCKET_URL = `${process.env.NEXT_PUBLIC_API_URL}/ws`;
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/rooms`;

let stompClient: Client | null = null;

/**
 * WebSocket 연결 및 구독
 * @param roomId 채팅방 ID
 * @param onMessage 수신 메시지 처리 콜백
 */
export function connectToRoom(
  roomId: number,
  onMessage: (msg: RoomMessageDto) => void
) {
  const socket = new SockJS(SOCKET_URL);

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000, // 자동 재연결
    onConnect: () => {
      stompClient?.subscribe(`/topic/room/${roomId}`, (message) => {
        const msg: RoomMessageDto = JSON.parse(message.body);
        onMessage(msg);
      });
    },
    onDisconnect: () => {},
    onStompError: (frame) => {
      console.error("STOMP Error:", frame.headers["message"]);
    },
  });

  stompClient.activate();
}

/**
 * WebSocket 연결 종료
 */
export function disconnectRoom() {
  stompClient?.deactivate();
  stompClient = null;
}

/**
 * 채팅/링크 메시지 전송 (WebSocket)
 * @param roomId 채팅방 ID
 * @param message RoomMessageDto
 */
export function sendRoomMessage(roomId: number, message: RoomMessageDto) {
  if (!stompClient || !stompClient.connected) {
    console.error("WebSocket is not connected.");
    return;
  }

  stompClient.publish({
    destination: `/app/room/${roomId}`,
    body: JSON.stringify(message),
  });
}

/**
 * 채팅 이력 조회 (REST)
 * @param roomId 채팅방 ID
 */
export async function getChatHistory(
  roomId: number
): Promise<RoomMessageDto[]> {
  const res = await axios.get(`${BASE_URL}/${roomId}/messages`, {
    withCredentials: true,
  });

  // ApiResponse 형태인지 확인하고 처리
  if (res.data && res.data.success !== undefined) {
    const apiResponse = res.data as ApiResponse<RoomMessageDto[]>;
    if (!apiResponse.success) {
      throw new Error(apiResponse.message);
    }
    return Array.isArray(apiResponse.data) ? apiResponse.data : [];
  }

  return res.data;
}

/**
 * 링크 추가 (REST + WebSocket 자동 브로드캐스트)
 * @param roomId 채팅방 ID
 * @param dto RoomLinkDto
 */
export async function addLink(
  roomId: number,
  dto: RoomLinkDto
): Promise<number> {
  const res = await axios.post(`${BASE_URL}/${roomId}/links`, dto, {
    withCredentials: true,
  });

  // ApiResponse 형태인지 확인하고 처리
  if (res.data && res.data.success !== undefined) {
    const apiResponse = res.data as ApiResponse<number>;
    if (!apiResponse.success) {
      throw new Error(apiResponse.message);
    }
    return apiResponse.data; // linkId 반환
  }

  return res.data; // linkId 반환
}

/**
 * 링크 수정 (REST + WebSocket 자동 브로드캐스트)
 * @param roomId 채팅방 ID
 * @param linkId 링크 ID
 * @param dto RoomLinkDto
 */
export async function updateLink(
  roomId: number,
  linkId: number,
  dto: RoomLinkDto
): Promise<string> {
  const res = await axios.put(`${BASE_URL}/${roomId}/links/${linkId}`, dto, {
    withCredentials: true,
  });

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
 * 링크 삭제 (REST + WebSocket 자동 브로드캐스트)
 * @param roomId 채팅방 ID
 * @param linkId 링크 ID
 */
export async function deleteLink(
  roomId: number,
  linkId: number
): Promise<string> {
  const res = await axios.delete(`${BASE_URL}/${roomId}/links/${linkId}`, {
    withCredentials: true,
  });

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
