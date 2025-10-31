"use client";
import React, { useState, useCallback, useMemo } from "react";

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
import { FloatingChat } from "@/features/room/components/FloatingChat";

export default function RoomPage() {
  const [activeTab, setActiveTab] = useState("links");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialTab, setChatInitialTab] = useState<"chat" | "link">("chat");
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

  // 계산된 값들 메모이제이션
  const isOwner = useMemo(
    () => room?.ownerId === userInfo?.id,
    [room?.ownerId, userInfo?.id]
  );
  const memberCount = useMemo(() => members?.length || 0, [members?.length]);
  const linkCount = useMemo(() => links?.length || 0, [links?.length]);

  // 타입 안전성을 위한 타입 가드
  const isValidUserId = useCallback(
    (id: any): id is number => typeof id === "number",
    []
  );

  // 키보드 이벤트 핸들러
  const handleRoomKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        saveRoomName();
      } else if (e.key === "Escape") {
        setEditingRoom(false);
        setRoomName(room?.name || "");
        setError(null);
      }
    },
    [saveRoomName, setEditingRoom, setRoomName, room?.name, setError]
  );

  const handleRoomNameChange = useCallback(
    (name: string) => {
      setRoomName(name);
      setError(null);
    },
    [setRoomName, setError]
  );

  const handleRoomEditStart = useCallback(() => {
    setEditingRoom(true);
  }, [setEditingRoom]);

  const handleRoomEditCancel = useCallback(() => {
    setEditingRoom(false);
    setRoomName(room?.name || "");
    setError(null);
  }, [setEditingRoom, setRoomName, room?.name, setError]);

  const handleInviteUser = useCallback(
    async (userId: number) => {
      return await inviteUserToRoom(userId);
    },
    [inviteUserToRoom]
  );

  // 네비게이션 핸들러들
  const handleBackToRoomList = useCallback(() => {
    router.push("/main/room");
  }, [router]);

  const handleNewLinkClick = useCallback(() => {
    setChatInitialTab("link");
    setIsChatOpen(true);
  }, []);

  // 탭 변경 핸들러 메모이제이션
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // 채팅 토글 핸들러
  const handleChatToggle = useCallback(() => {
    if (!isChatOpen) {
      setChatInitialTab("chat"); // 일반적으로 채팅 열 때는 채팅 탭
    }
    setIsChatOpen((prev) => !prev);
  }, [isChatOpen]);

  // 네비게이션 컴포넌트들 메모이제이션
  const MobileNavigation = useMemo(
    () => (
      <div className="md:hidden mb-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <button
          onClick={handleBackToRoomList}
          className="flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition-colors w-full"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">링크룸 목록으로 돌아가기</span>
        </button>
      </div>
    ),
    [handleBackToRoomList]
  );

  const DesktopBreadcrumb = useMemo(
    () => (
      <nav className="hidden md:block mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button
            onClick={handleBackToRoomList}
            className="hover:text-amber-600 transition-colors font-medium"
          >
            링크룸 목록
          </button>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-gray-800 font-medium">
            {room?.name || "링크룸"}
          </span>
        </div>
      </nav>
    ),
    [handleBackToRoomList, room?.name]
  );

  const TabButtons = useMemo(
    () => (
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          className={`flex-1 px-6 py-4 font-medium focus:outline-none transition-all duration-100 ${
            activeTab === "links"
              ? "bg-white border-b-2 border-amber-600 text-amber-700"
              : "text-gray-600 hover:text-amber-700 hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("links")}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 00-1.414-1.414l-1.5 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <span>링크 공유</span>
          </div>
        </button>
        <button
          className={`flex-1 px-6 py-4 font-medium focus:outline-none transition-all duration-100 ${
            activeTab === "members"
              ? "bg-white border-b-2 border-amber-600 text-amber-700"
              : "text-gray-600 hover:text-amber-700 hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("members")}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            <span>멤버 ({memberCount})</span>
          </div>
        </button>
        <button
          className={`flex-1 px-6 py-4 font-medium focus:outline-none transition-all duration-100 ${
            activeTab === "invite"
              ? "bg-white border-b-2 border-amber-600 text-amber-700"
              : "text-gray-600 hover:text-amber-700 hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("invite")}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>친구 초대</span>
          </div>
        </button>
      </div>
    ),
    [activeTab, handleTabChange, memberCount]
  );

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

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {MobileNavigation}
        {DesktopBreadcrumb}

        {/* 헤더 영역 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* 뒤로가기 버튼 */}
              <button
                onClick={handleBackToRoomList}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors group md:mr-2"
                title="링크룸 목록으로 돌아가기"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-amber-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 00-1.414-1.414l-1.5 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {room?.name || "링크룸"}
                  </h1>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <button
                    onClick={handleBackToRoomList}
                    className="hover:text-amber-600 transition-colors"
                  >
                    링크룸 목록
                  </button>
                  <span>•</span>
                  <span>{memberCount}명의 멤버</span>
                  <span>•</span>
                  <span>{linkCount}개의 링크</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNewLinkClick}
                className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>새 링크 추가</span>
              </button>
              {isOwner && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                  방장
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {TabButtons}

          <div className="p-6 min-h-[400px] transition-all duration-150">
            {activeTab === "members" && (
              <div className="animate-in fade-in duration-150">
                <MemberList
                  members={members || []}
                  currentUserId={userInfo?.id}
                />
              </div>
            )}
            {activeTab === "invite" && (
              <div className="animate-in fade-in duration-150">
                <InviteUserForm
                  invitableFriends={invitableFriends}
                  loadingFriends={loadingFriends}
                  onInvite={handleInviteUser}
                  onRefresh={loadInvitableFriends}
                  error={error && !editingRoom ? error : null}
                />
              </div>
            )}
            {activeTab === "links" &&
              userInfo &&
              isValidUserId(userInfo.id) && (
                <div className="animate-in fade-in duration-150">
                  <RoomLinkList
                    links={links}
                    loading={loadingLinks}
                    roomId={roomId}
                    currentUserId={userInfo.id}
                  />
                </div>
              )}
          </div>
        </div>
      </div>

      {/* 플로팅 채팅 */}
      {userInfo && isValidUserId(userInfo.id) && (
        <FloatingChat
          roomId={roomId}
          currentUserId={userInfo.id}
          currentUserName={userInfo.nickname || ""}
          isOpen={isChatOpen}
          onToggle={handleChatToggle}
          initialTab={chatInitialTab}
        />
      )}
    </>
  );
}
