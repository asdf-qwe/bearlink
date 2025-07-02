"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRoomPage } from "@/features/room/hooks/useRoomPage";
import {
  LoadingState,
  ErrorState,
  NotFoundState,
} from "@/features/room/components/PageStates";
import { RoomHeader } from "@/features/room/components/RoomHeader";
import { MemberList } from "@/features/room/components/MemberList";
import { InviteUserForm } from "@/features/room/components/InviteUserForm";
import { RoomLinkList } from "@/features/room/components/RoomLinkList";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const { userInfo } = useAuth();
  const roomId = Number(params.id as string);

  const {
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
    inviteUserToRoom,
    saveRoomName,
  } = useRoomPage({ roomId, userId: userInfo?.id });

  // 키보드 이벤트 핸들러
  const handleRoomKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveRoomName();
    } else if (e.key === "Escape") {
      setEditingRoom(false);
      setRoomName(room?.name || "");
      setError(null);
    }
  };

  const handleRoomNameChange = (name: string) => {
    setRoomName(name);
    setError(null);
  };

  const handleRoomEditStart = () => {
    setEditingRoom(true);
  };

  const handleRoomEditCancel = () => {
    setEditingRoom(false);
    setRoomName(room?.name || "");
    setError(null);
  };

  const handleInviteUser = async (email: string) => {
    // 실제 구현에서는 이메일로 사용자 ID를 가져오는 API 호출 필요
    // 지금은 임시로 사용자 ID를 1로 고정합니다.
    const mockUserId = 1;
    return await inviteUserToRoom(mockUserId);
  };

  // 로딩 상태
  if (loading) {
    return <LoadingState message="링크룸을 불러오는 중..." />;
  }

  // 에러 상태
  if (error && !room) {
    return <ErrorState error={error} onBack={() => router.back()} />;
  }

  // 링크룸 없음 상태
  if (!room) {
    return <NotFoundState onBack={() => router.back()} />;
  }

  // 사용자가 방장인지 확인
  const isOwner = room.ownerId === userInfo?.id;

  return (
    <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
      {/* 링크룸 헤더 */}
      <RoomHeader
        roomName={roomName}
        editingRoom={editingRoom}
        error={error && editingRoom ? error : null}
        onEditStart={handleRoomEditStart}
        onRoomNameChange={handleRoomNameChange}
        onSave={saveRoomName}
        onCancel={handleRoomEditCancel}
        onKeyPress={handleRoomKeyPress}
      />

      {/* 멤버 목록 */}
      <MemberList members={members || []} currentUserId={userInfo?.id} />

      {/* 사용자 초대 폼 (방장만 볼 수 있음) */}
      {isOwner && (
        <InviteUserForm
          onInvite={handleInviteUser}
          error={error && !editingRoom ? error : null}
        />
      )}

      {/* 링크룸 내의 공유 링크 목록 */}
      <RoomLinkList links={links} loading={loadingLinks} />
    </div>
  );
}
