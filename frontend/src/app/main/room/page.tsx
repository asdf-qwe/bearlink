"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
  const [activeTab, setActiveTab] = useState("myRooms");

  // 초대 관련 상태
  const [receivedInvitations, setReceivedInvitations] = useState<
    InvitationResponse[]
  >([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [invitationError, setInvitationError] = useState<string | null>(null);

  // 계산된 값들 메모이제이션
  const roomCount = useMemo(() => rooms?.length || 0, [rooms?.length]);
  const invitationCount = useMemo(
    () => receivedInvitations?.length || 0,
    [receivedInvitations?.length]
  );

  // 핸들러들 메모이제이션
  const handleShowCreateForm = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  const handleHideCreateForm = useCallback(() => {
    setShowCreateForm(false);
    setNewRoomName("");
    setError(null);
  }, []);

  const handleRoomClick = useCallback(
    (roomId: number) => {
      router.push(`/main/room/${roomId}`);
    },
    [router]
  );

  // 방 목록 로드
  // 받은 초대 목록 로드 함수
  const loadReceivedInvitations = useCallback(async () => {
    if (!userInfo?.id) return;

    try {
      setLoadingInvitations(true);
      setInvitationError(null);
      const invitationsList = await roomService.getMyInvitations();
      setReceivedInvitations(invitationsList || []);
    } catch (err: any) {
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
  const handleAcceptInvitation = useCallback(
    async (roomMemberId: number) => {
      if (!userInfo?.id) return;

      try {
        setInvitationError(null);
        await roomService.acceptInvitation(roomMemberId);

        // 초대 목록과 방 목록 새로고침
        loadReceivedInvitations();
        loadRooms();

        return true;
      } catch (error) {
        setInvitationError("초대 수락에 실패했습니다. 다시 시도해주세요.");
        return false;
      }
    },
    [userInfo?.id, loadReceivedInvitations]
  );

  // 초대 거절 핸들러
  const handleDeclineInvitation = useCallback(
    async (roomMemberId: number) => {
      if (!userInfo?.id) return;

      try {
        setInvitationError(null);
        await roomService.declineInvitation(roomMemberId);

        // 초대 목록 새로고침
        await loadReceivedInvitations();

        return true;
      } catch (error) {
        setInvitationError("초대 거절에 실패했습니다. 다시 시도해주세요.");
        return false;
      }
    },
    [userInfo?.id, loadReceivedInvitations]
  );

  // 방 목록 로드 함수
  const loadRooms = useCallback(async () => {
    if (!userInfo?.id) return;

    try {
      setLoading(true);
      const roomList = await roomService.getRooms();
      setRooms(roomList);
    } catch (err) {
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

  // 탭 변경 핸들러 메모이제이션
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // 새 링크룸 생성
  const handleCreateRoom = useCallback(
    async (e: React.FormEvent) => {
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
        setError("링크룸 생성에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setCreating(false);
      }
    },
    [newRoomName, userInfo, router]
  );

  // 탭 버튼들 메모이제이션
  const TabButtons = useMemo(
    () => (
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          className={`flex-1 px-6 py-4 font-medium focus:outline-none transition-all duration-100 ${
            activeTab === "myRooms"
              ? "bg-white border-b-2 border-amber-600 text-amber-700"
              : "text-gray-600 hover:text-amber-700 hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("myRooms")}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>내 링크룸 ({roomCount})</span>
          </div>
        </button>
        <button
          className={`flex-1 px-6 py-4 font-medium focus:outline-none transition-all duration-100 ${
            activeTab === "invitations"
              ? "bg-white border-b-2 border-amber-600 text-amber-700"
              : "text-gray-600 hover:text-amber-700 hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("invitations")}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>받은 초대 ({invitationCount})</span>
          </div>
        </button>
      </div>
    ),
    [activeTab, handleTabChange, roomCount, invitationCount]
  );

  // 방 생성 폼 메모이제이션
  const CreateRoomForm = useMemo(() => {
    if (!showCreateForm) return null;

    return (
      <div className="mb-8">
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              새 링크룸 만들기
            </h2>
          </div>
          <form onSubmit={handleCreateRoom} className="space-y-6">
            <div>
              <label
                htmlFor="roomName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                링크룸 이름
              </label>
              <input
                type="text"
                id="roomName"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                placeholder="예: 개발 팀 링크 모음"
                required
                autoFocus
                disabled={creating}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleHideCreateForm}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                disabled={creating}
              >
                취소
              </button>
              <button
                type="submit"
                className={`px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md ${
                  creating ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={creating || !newRoomName.trim()}
              >
                {creating ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    생성 중...
                  </div>
                ) : (
                  "생성하기"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }, [
    showCreateForm,
    handleCreateRoom,
    newRoomName,
    creating,
    handleHideCreateForm,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-amber-100">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="animate-spin h-8 w-8 text-white"
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
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            링크룸을 불러오는 중...
          </h3>
          <p className="text-gray-600">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    링크룸 관리
                  </h1>
                  <p className="text-gray-600">
                    친구들과 링크를 공유하고 소통해보세요
                  </p>
                </div>
                {activeTab === "myRooms" && (
                  <button
                    onClick={handleShowCreateForm}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
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
                )}
              </div>
            </div>

            {/* 탭 메뉴 */}
            {TabButtons}
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center shadow-sm">
              <svg
                className="w-5 h-5 mr-3 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* 컨텐츠 영역 - 탭 기반 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 min-h-96">
          {/* 내 링크룸 탭 */}
          {activeTab === "myRooms" && (
            <div className="p-6 animate-in fade-in duration-150">
              {CreateRoomForm}

              {/* 내 링크룸 목록 */}
              {rooms.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    아직 링크룸이 없어요
                  </h3>
                  <p className="text-gray-600 mb-6">
                    첫 번째 링크룸을 만들어보세요!
                  </p>
                  <button
                    onClick={handleShowCreateForm}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    링크룸 만들기
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="group flex items-center justify-between p-6 hover:bg-slate-50 transition-all duration-200 cursor-pointer first:pt-0"
                      onClick={() => handleRoomClick(room.id)}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        {/* 룸 아이콘 */}
                        <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center group-hover:bg-amber-700 transition-all duration-200 shadow-sm">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>

                        {/* 룸 정보 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-amber-700 transition-colors duration-200 truncate">
                            {room.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            생성일:{" "}
                            {room.createdAt
                              ? new Date(room.createdAt).toLocaleDateString(
                                  "ko-KR"
                                )
                              : "날짜 없음"}
                          </div>
                        </div>
                      </div>

                      {/* 입장 버튼 */}
                      <div className="flex items-center space-x-3">
                        <span className="hidden sm:inline-block text-sm text-amber-600 font-medium group-hover:text-amber-700 transition-colors duration-200">
                          룸 입장하기
                        </span>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 받은 초대 탭 */}
          {activeTab === "invitations" && (
            <div className="p-6 animate-in fade-in duration-150">
              <ReceivedInvitationsList
                invitations={receivedInvitations}
                loading={loadingInvitations}
                onAccept={handleAcceptInvitation}
                onDecline={handleDeclineInvitation}
                onRefresh={loadReceivedInvitations}
                error={invitationError}
              />
            </div>
          )}
        </div>

        {/* 링크룸이 없을 경우 메시지 표시 */}
        {rooms.length === 0 && !showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-amber-100">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="h-12 w-12 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                첫 번째 링크룸을 만들어보세요!
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                친구들과 함께 유용한 링크를 공유하고, 실시간으로 소통할 수 있는
                공간을 만들어보세요.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleShowCreateForm}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                첫 번째 링크룸 만들기
              </button>
            </div>

            {/* 기능 소개 */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    링크 공유
                  </h4>
                  <p className="text-sm text-gray-600">
                    유용한 링크를 쉽게 공유하고 정리하세요
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5zM15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    실시간 채팅
                  </h4>
                  <p className="text-sm text-gray-600">
                    친구들과 실시간으로 대화해보세요
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    친구 초대
                  </h4>
                  <p className="text-sm text-gray-600">
                    친구를 초대해서 함께 사용해보세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
