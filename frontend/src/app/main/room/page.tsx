"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { roomService } from "@/features/room/service/roomService";
import { RoomsDto, InvitationResponse } from "@/features/room/type/room";
import { ReceivedInvitationsList } from "@/features/room/components/ReceivedInvitationsList";

export default function RoomListPage() {
  const router = useRouter();
  const { userInfo } = useAuth();
  const [rooms, setRooms] = useState<RoomsDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [creating, setCreating] = useState(false);

  // 초대 관련 상태
  const [receivedInvitations, setReceivedInvitations] = useState<
    InvitationResponse[]
  >([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [invitationError, setInvitationError] = useState<string | null>(null);

  // 방 목록 로드
  // 받은 초대 목록 로드 함수
  const loadReceivedInvitations = useCallback(async () => {
    if (!userInfo?.id) return;

    try {
      setLoadingInvitations(true);
      setInvitationError(null);
      console.log("받은 초대 목록 로딩 시작...");
      const invitationsList = await roomService.getMyInvitations();
      console.log("받은 초대 목록:", invitationsList);
      setReceivedInvitations(invitationsList || []);
    } catch (err: any) {
      console.error("초대 목록 로딩 실패:", err);

      // 에러 종류에 따라 다른 메시지 표시
      if (err?.response?.status === 500) {
        setInvitationError(
          "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      } else if (err?.response?.status === 401) {
        setInvitationError("로그인이 필요하거나 권한이 없습니다.");
      } else if (err?.response?.status === 404) {
        setInvitationError("요청한 리소스를 찾을 수 없습니다.");
      } else {
        setInvitationError(
          "초대 목록을 불러오는데 실패했습니다. " + (err?.message || "")
        );
      }

      setReceivedInvitations([]);
    } finally {
      setLoadingInvitations(false);
    }
  }, [userInfo?.id]);

  // 초대 수락 핸들러
  const handleAcceptInvitation = async (roomMemberId: number) => {
    if (!userInfo?.id) return;

    try {
      setInvitationError(null);
      await roomService.acceptInvitation(roomMemberId);

      // 초대 목록과 방 목록 새로고침
      await loadReceivedInvitations();
      await loadRooms();

      return true;
    } catch (error) {
      console.error("초대 수락 실패:", error);
      setInvitationError("초대 수락에 실패했습니다. 다시 시도해주세요.");
      return false;
    }
  };

  // 초대 거절 핸들러
  const handleDeclineInvitation = async (roomMemberId: number) => {
    if (!userInfo?.id) return;

    try {
      setInvitationError(null);
      await roomService.declineInvitation(roomMemberId);

      // 초대 목록 새로고침
      await loadReceivedInvitations();

      return true;
    } catch (error) {
      console.error("초대 거절 실패:", error);
      setInvitationError("초대 거절에 실패했습니다. 다시 시도해주세요.");
      return false;
    }
  };

  // 방 목록 로드 함수
  const loadRooms = useCallback(async () => {
    if (!userInfo?.id) return;

    try {
      setLoading(true);
      const roomList = await roomService.getRooms();
      setRooms(roomList);
    } catch (err) {
      console.error("링크룸 목록 로딩 실패:", err);
      setError("링크룸 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [userInfo?.id]);

  // 사이드바에서 roomUpdated 이벤트 발생 시 목록 새로고침
  useEffect(() => {
    const handleRoomUpdated = () => {
      loadRooms();
    };
    window.addEventListener("roomUpdated", handleRoomUpdated);
    return () => {
      window.removeEventListener("roomUpdated", handleRoomUpdated);
    };
  }, [loadRooms]);

  // 초기 데이터 로드
  useEffect(() => {
    loadRooms();
    loadReceivedInvitations();
  }, [loadRooms, loadReceivedInvitations]);

  // 새 링크룸 생성
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !userInfo) return;

    try {
      setCreating(true);
      setError(null);

      const response = await roomService.createRoom({
        name: newRoomName.trim(),
      });

      // 생성 후 새 방으로 이동
      router.push(`/main/room/${response.roomId}`);
    } catch (err) {
      console.error("링크룸 생성 실패:", err);
      setError("링크룸 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen -mt-16">
        <div className="text-amber-600">
          <svg
            className="animate-spin h-10 w-10 mr-3 inline-block"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-lg">링크룸 목록을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">내 링크룸</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          새 링크룸 만들기
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* 받은 초대 목록 - 항상 표시되도록 설정됨 */}
      <ReceivedInvitationsList
        invitations={receivedInvitations}
        loading={loadingInvitations}
        onAccept={handleAcceptInvitation}
        onDecline={handleDeclineInvitation}
        onRefresh={loadReceivedInvitations}
        error={invitationError}
      />

      {/* 링크룸 생성 폼 */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">새 링크룸 만들기</h2>
          <form onSubmit={handleCreateRoom}>
            <div className="mb-4">
              <label
                htmlFor="roomName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                링크룸 이름
              </label>
              <input
                type="text"
                id="roomName"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="링크룸 이름을 입력하세요"
                required
                autoFocus
                disabled={creating}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewRoomName("");
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                disabled={creating}
              >
                취소
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors ${
                  creating ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={creating || !newRoomName.trim()}
              >
                {creating ? "생성중..." : "생성하기"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 링크룸 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/main/room/${room.id}`)}
          >
            <h2 className="text-xl font-semibold mb-2 truncate">{room.name}</h2>
            <div className="text-gray-500 text-sm">
              {room.createdAt
                ? new Date(room.createdAt).toLocaleDateString()
                : "날짜 없음"}
            </div>
          </div>
        ))}
      </div>

      {/* 링크룸이 없을 경우 메시지 표시 */}
      {rooms.length === 0 && !showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-amber-500 text-4xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">
            아직 링크룸이 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            새 링크룸을 만들어 친구들과 함께 링크를 공유해보세요!
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            첫 번째 링크룸 만들기
          </button>
        </div>
      )}
    </div>
  );
}
