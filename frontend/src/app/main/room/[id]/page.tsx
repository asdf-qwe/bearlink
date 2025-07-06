"use client";
import React, { useState } from "react";

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
import { RoomChatDummy } from "@/features/room/components/RoomChatDummy";

export default function RoomPage() {
  const [activeTab, setActiveTab] = useState("members");
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
    invitableFriends,
    loadingFriends,

    // Setters
    setRoomName,
    setEditingRoom,
    setError,

    // Actions
    inviteUserToRoom,
    saveRoomName,
    loadInvitableFriends,
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

  const handleInviteUser = async (userId: number) => {
    return await inviteUserToRoom(userId);
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
      {/* 링크룸 제목 */}
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-amber-900">
        {room?.name || "링크룸"}
      </h1>

      {/* 탭 메뉴 */}
      <div className="flex space-x-2 mt-8 mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold focus:outline-none ${
            activeTab === "members"
              ? "bg-white border-x border-t border-amber-400 text-amber-700"
              : "bg-amber-100 text-amber-700"
          }`}
          onClick={() => setActiveTab("members")}
        >
          멤버
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold focus:outline-none ${
            activeTab === "invite"
              ? "bg-white border-x border-t border-amber-400 text-amber-700"
              : "bg-amber-100 text-amber-700"
          }`}
          onClick={() => setActiveTab("invite")}
        >
          친구 초대
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold focus:outline-none ${
            activeTab === "links"
              ? "bg-white border-x border-t border-amber-400 text-amber-700"
              : "bg-amber-100 text-amber-700"
          }`}
          onClick={() => setActiveTab("links")}
        >
          공유된 링크
        </button>
      </div>

      <div className="bg-white rounded-b-lg shadow-md p-6 min-h-[300px]">
        {activeTab === "members" && (
          <MemberList members={members || []} currentUserId={userInfo?.id} />
        )}
        {activeTab === "invite" && (
          <InviteUserForm
            invitableFriends={invitableFriends}
            loadingFriends={loadingFriends}
            onInvite={handleInviteUser}
            onRefresh={loadInvitableFriends}
            error={error && !editingRoom ? error : null}
          />
        )}
        {activeTab === "links" && (
          <RoomLinkList links={links} loading={loadingLinks} />
        )}
      </div>
    </div>
  );
}
