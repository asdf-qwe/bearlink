import {
  connectToRoom,
  disconnectRoom,
  getLinks,
} from "@/features/room/service/roomChatService";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { roomService } from "@/features/room/service/roomService";

import {
  RoomWithMembers,
  RoomMember,
} from "@/features/room/type/roomPageTypes";
import {
  RoomLinkListDto,
  InviteFriendWithStatusResponse,
  InvitationResponse,
} from "@/features/room/type/room";

interface UseRoomPageProps {
  roomId: number;
  userId?: number;
}

export const useRoomPage = ({ roomId, userId }: UseRoomPageProps) => {
  // 실시간 링크 동기화: 웹소켓 메시지 수신 시 목록 새로고침
  // 반드시 useRoomPage 함수 내부에서 선언되어야 roomId, userId, setLinks 접근 가능
  // (이 코드는 useRoomPage 함수 본문 안에 위치해야 함)
  useEffect(() => {
    if (!roomId || !userId) return;
    let mounted = true;
    connectToRoom(roomId, async (msg) => {
      if (["LINK_ADD", "LINK_UPDATE", "LINK_DELETE"].includes(msg.type)) {
        const linksList = await getLinks(roomId);
        const mappedLinks = linksList.map((link) => ({
          id: link.id, // id는 백엔드에서 제공하는 id 사용
          title: link.title,
          url: link.url,
          thumbnailImageUrl: link.thumbnailImageUrl ?? undefined,
        }));
        if (mounted) {
          setLinks(mappedLinks);
        }
      }
    });
    return () => {
      mounted = false;
      disconnectRoom();
    };
  }, [roomId, userId]);
  const router = useRouter();
  const [room, setRoom] = useState<RoomWithMembers | null>(null);
  const [roomName, setRoomName] = useState("");
  const [editingRoom, setEditingRoom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [links, setLinks] = useState<RoomLinkListDto[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [invitableFriends, setInvitableFriends] = useState<
    InviteFriendWithStatusResponse[]
  >([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  // 받은 초대 목록을 위한 상태
  const [receivedInvitations, setReceivedInvitations] = useState<
    InvitationResponse[]
  >([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);

  // 받은 초대 목록 로드
  const loadReceivedInvitations = useCallback(async () => {
    if (!userId) return;

    try {
      setLoadingInvitations(true);
      console.log("받은 초대 목록 로딩 시작...");
      const invitationsList = await roomService.getMyInvitations();
      console.log("받은 초대 목록:", invitationsList);
      setReceivedInvitations(invitationsList || []);
    } catch (err) {
      console.error("초대 목록 로딩 실패:", err);
      setReceivedInvitations([]);
      setError(
        "초대 목록을 불러오는데 실패했습니다. 서버에 연결할 수 없거나 권한이 없습니다."
      );
    } finally {
      setLoadingInvitations(false);
    }
  }, [userId]);

  // 초대 가능한 친구 목록 로드
  const loadInvitableFriends = useCallback(
    async (forceRefresh = true) => {
      if (!userId || !roomId) return;

      try {
        setLoadingFriends(true);
        console.log(`방 ID ${roomId}에 대한 친구 목록 로딩 시작...`);
        const friendsList = await roomService.getInvitableFriends(roomId);
        console.log("받은 친구 목록:", friendsList);

        if (friendsList && friendsList.length > 0) {
          // 초대 상태별로 친구 수 카운트
          const statusCount: Record<string, number> = {
            NOT_INVITED: 0,
            INVITED: 0,
            ACCEPTED: 0,
            DECLINED: 0,
          };

          friendsList.forEach((friend: any) => {
            if (friend.invitationStatus) {
              statusCount[friend.invitationStatus] =
                (statusCount[friend.invitationStatus] || 0) + 1;
            } else {
              statusCount.NOT_INVITED++;
            }
          });

          console.log("초대 상태 통계:", statusCount);
        }

        setInvitableFriends(friendsList || []);
      } catch (err) {
        console.error(
          `방 ID ${roomId}에 대한 초대 가능한 친구 목록 로딩 실패:`,
          err
        );
        setInvitableFriends([]);
        setError("초대 가능한 친구 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoadingFriends(false);
      }
    },
    [userId, roomId]
  );

  // 링크룸 및 링크 목록 로드
  const loadRoom = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setLoadingLinks(true);
      setError(null);

      // 1. 방 정보 API로 방 이름 등 받아오기
      const roomData = await roomService.getRoomById(roomId);
      setRoom(roomData);
      setRoomName(roomData.name);

      // 2. 링크 목록 받아오기 (roomChatService의 getLinks 사용)
      const linksList = await getLinks(roomId);
      // RoomLinkListDto[]를 그대로 사용 (id는 백엔드에서 제공)
      setLinks(linksList);

      // 3. 멤버 목록 받아오기
      try {
        const membersList = await roomService.getMembers(roomId);
        console.log(`멤버 목록 조회 성공: ${membersList.length}명`);
        const transformedMembers = membersList.map((member: any) => ({
          id: member.userId,
          userId: member.userId,
          username: member.nickname,
          role: "MEMBER" as const,
          status: "ACCEPTED" as const,
        }));
        setMembers(transformedMembers);
      } catch (err) {
        console.warn("링크룸 멤버 가져오기 실패:", err);
        setMembers([]);
      }
      console.log(`링크룸(ID: ${roomId}) 정보 및 데이터 로드 완료`);
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
        // 초대 API 호출
        await roomService.inviteUser(roomId, invitedUserId);

        // 백엔드 API 변경으로 인해 멤버 목록 대신 초대 가능한 친구 목록만 새로고침
        // (멤버는 수락 후에만 추가됨)
        await loadInvitableFriends();

        return true;
      } catch (error) {
        console.error("사용자 초대 실패:", error);
        setError("사용자 초대에 실패했습니다. 다시 시도해주세요.");
        return false;
      }
    },
    [room, userId, roomId, loadInvitableFriends]
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
    loadInvitableFriends();
    loadReceivedInvitations();
  }, [loadRoom, loadInvitableFriends, loadReceivedInvitations]);

  // 초대 수락 처리 함수
  const acceptRoomInvitation = useCallback(
    async (roomMemberId: number) => {
      if (!userId) return;

      try {
        await roomService.acceptInvitation(roomMemberId);
        // 초대 목록 새로고침
        await loadReceivedInvitations();
        // 방 정보 새로고침
        await loadRoom();
        return true;
      } catch (error) {
        console.error("초대 수락 실패:", error);
        setError("초대 수락에 실패했습니다. 다시 시도해주세요.");
        return false;
      }
    },
    [userId, loadReceivedInvitations, loadRoom]
  );

  // 초대 거절 처리 함수
  const declineRoomInvitation = useCallback(
    async (roomMemberId: number) => {
      if (!userId) return;

      try {
        await roomService.declineInvitation(roomMemberId);
        // 초대 목록 새로고침
        await loadReceivedInvitations();
        return true;
      } catch (error) {
        console.error("초대 거절 실패:", error);
        setError("초대 거절에 실패했습니다. 다시 시도해주세요.");
        return false;
      }
    },
    [userId, loadReceivedInvitations]
  );

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
    invitableFriends,
    loadingFriends,
    receivedInvitations,
    loadingInvitations,

    // Setters
    setRoomName,
    setEditingRoom,
    setError,

    // Actions
    loadRoom,
    loadInvitableFriends,
    loadReceivedInvitations,
    inviteUserToRoom,
    acceptRoomInvitation,
    declineRoomInvitation,
    saveRoomName,
  };
};
