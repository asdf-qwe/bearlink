import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { roomService } from "@/features/room/service/roomService";
import {
  RoomWithMembers,
  RoomMember,
} from "@/features/room/type/roomPageTypes";
import { RoomLinkListDto } from "@/features/room/type/room";

interface UseRoomPageProps {
  roomId: number;
  userId?: number;
}

export const useRoomPage = ({ roomId, userId }: UseRoomPageProps) => {
  const router = useRouter();
  const [room, setRoom] = useState<RoomWithMembers | null>(null);
  const [roomName, setRoomName] = useState("");
  const [editingRoom, setEditingRoom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [links, setLinks] = useState<RoomLinkListDto[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);

  // 링크룸 및 링크 목록 로드
  const loadRoom = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setLoadingLinks(true);
      setError(null);

      // 링크 목록 API를 통해 링크룸 정보와 링크를 함께 가져옵니다
      const linksList = await roomService.getRoomLinks(roomId);
      setLinks(linksList);

      try {
        // 멤버 목록도 함께 조회
        const membersList = await roomService.getRoomMembers(roomId);

        // 실제로는 링크 API 응답에서 방 정보를 추출해야 하지만
        // 임시로 방 ID만으로 객체 생성
        const roomData = { id: roomId, name: `링크룸 ${roomId}` };

        const roomWithMembers: RoomWithMembers = {
          ...roomData,
          members: membersList,
        };

        setRoom(roomWithMembers);
        setRoomName(roomData.name);
        setMembers(membersList);
      } catch (err) {
        console.warn("링크룸 멤버 가져오기 실패:", err);
        // 최소한의 방 정보라도 설정
        const roomData = { id: roomId, name: `링크룸 ${roomId}` };
        setRoom(roomData);
        setRoomName(roomData.name);
      }
    } catch (err) {
      console.error("링크룸 로딩 실패:", err);
      setError("링크룸을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
      setLoadingLinks(false);
    }
  }, [roomId, userId]);

  // 초대 처리 함수
  const inviteUserToRoom = useCallback(
    async (invitedUserId: number) => {
      if (!room || !userId) return;

      setError(null);

      try {
        await roomService.inviteUser(roomId, invitedUserId);
        // 초대 후 멤버 목록 새로고침
        const updatedMembers = await roomService.getRoomMembers(roomId);
        setMembers(updatedMembers);
        return true;
      } catch (error) {
        console.error("사용자 초대 실패:", error);
        setError("사용자 초대에 실패했습니다. 다시 시도해주세요.");
        return false;
      }
    },
    [room, userId, roomId]
  );

  // 링크룸 이름 저장
  const saveRoomName = useCallback(async () => {
    if (!room || roomName.trim() === "" || !userId) return;

    try {
      setError(null);
      // 이 부분은 백엔드 API가 구현되어 있다면 추가해야 합니다
      // await roomService.updateRoom({ name: roomName.trim() }, room.id);

      const updatedRoom = { ...room, name: roomName.trim() };
      setRoom(updatedRoom);
      setEditingRoom(false);
    } catch (error) {
      console.error("링크룸 이름 업데이트 실패:", error);
      setError("링크룸 이름 수정에 실패했습니다. 다시 시도해주세요.");
      setRoomName(room.name);
    }
  }, [room, roomName, userId]);

  // 초기 로드
  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  return {
    // State
    room,
    roomName,
    editingRoom,
    loading,
    error,
    members,
    links,
    loadingLinks,

    // Setters
    setRoomName,
    setEditingRoom,
    setError,

    // Actions
    loadRoom,
    inviteUserToRoom,
    saveRoomName,
  };
};
