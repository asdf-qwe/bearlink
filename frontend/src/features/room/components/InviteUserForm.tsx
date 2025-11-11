import React, { useState, useEffect } from "react";
import { InviteFriendWithStatusResponse } from "@/features/room/type/room";

interface InviteUserFormProps {
  invitableFriends: InviteFriendWithStatusResponse[];
  loadingFriends: boolean;
  onInvite: (userId: number) => Promise<boolean | undefined>;
  onRefresh: () => void;
  error: string | null;
}

export const InviteUserForm: React.FC<InviteUserFormProps> = ({
  invitableFriends,
  loadingFriends,
  onInvite,
  onRefresh,
  error,
}) => {
  const [inviting, setInviting] = useState<number | null>(null); // 초대 중인 친구 ID
  const [showForm, setShowForm] = useState(false);

  // 폼이 표시될 때 새로고침
  useEffect(() => {
    if (showForm) {
      onRefresh();
    }
  }, [showForm, onRefresh]);

  // 친구 초대 가능 여부 확인
  const canInviteFriend = (status: string) => {
    // NOT_INVITED 상태만 초대 가능
    return status === "NOT_INVITED";
  };

  // 친구 초대 처리
  const handleInvite = async (userId: number) => {
    if (inviting !== null) return; // 이미 초대 진행 중인 경우

    setInviting(userId);
    try {
      const success = await onInvite(userId);
      if (success) {
        onRefresh(); // 초대 후 목록 새로고침
      }
    } finally {
      setInviting(null);
    }
  };

  // 상태에 따른 배지 텍스트와 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "INVITED":
        return { text: "초대중", color: "bg-blue-100 text-blue-800" };
      case "ACCEPTED":
        return { text: "수락됨", color: "bg-green-100 text-green-800" };
      case "DECLINED":
        return { text: "거절됨", color: "bg-red-100 text-red-800" };
      case "NOT_INVITED":
        return { text: "초대 가능", color: "bg-amber-100 text-amber-800" };
      default:
        return { text: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-white border-2 border-amber-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-amber-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-amber-900">
              친구 초대하기
            </h2>
            <button
              type="button"
              onClick={() => {
                onRefresh();
              }}
              className="px-3 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition flex items-center shadow-sm"
              disabled={loadingFriends}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {loadingFriends ? "로딩 중..." : "새로고침"}
            </button>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-700"></div>
              <span className="ml-2 text-amber-700">
                친구 목록을 불러오는 중...
              </span>
            </div>
          ) : invitableFriends.length === 0 ? (
            <div className="bg-amber-50 p-12 text-center border border-amber-600 rounded-xl">
              <div className="w-16 h-16 bg-white border-2 border-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-amber-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-amber-900 mb-2">
                초대할 수 있는 친구가 없습니다
              </h3>
              <p className="text-amber-700 text-sm">
                친구 추가 후 다시 시도해주세요
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {invitableFriends.map((friend) => {
                    const statusBadge = getStatusBadge(friend.invitationStatus);
                    const isInvitable = canInviteFriend(
                      friend.invitationStatus
                    );
                    const isInviting = inviting === friend.userId;

                    return (
                      <div
                        key={friend.userId}
                        className={`relative p-4 rounded-lg border transition-all duration-200 ${
                          isInvitable
                            ? "bg-white border-amber-600 hover:shadow-md hover:bg-amber-50"
                            : "bg-gray-50 border-amber-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-lg">
                              {friend.nickname.substring(0, 1).toUpperCase()}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-amber-900">
                                {friend.nickname}
                              </h3>
                              <span
                                className={`text-xs px-3 py-1 rounded-full font-medium ${statusBadge.color}`}
                              >
                                {statusBadge.text}
                              </span>
                            </div>
                            <p className="text-amber-700 text-sm mt-1">
                              {friend.email}
                            </p>

                            {isInvitable && (
                              <button
                                type="button"
                                onClick={() => handleInvite(friend.userId)}
                                disabled={isInviting || loadingFriends}
                                className={`mt-3 w-full py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                                  isInviting || loadingFriends
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-amber-700 hover:bg-amber-800 text-white shadow-sm hover:shadow-md"
                                }`}
                              >
                                {isInviting ? (
                                  <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span>초대중...</span>
                                  </div>
                                ) : (
                                  "초대하기"
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 상태 설명 */}
              <div className="mt-4 border-t pt-3 text-xs text-gray-500">
                <ul className="space-y-1">
                  <li>• 초대 가능: 아직 초대하지 않은 친구입니다</li>
                  <li>
                    • 초대중: 초대 메시지를 보냈지만 아직 응답이 없는 상태입니다
                  </li>
                  <li>• 수락됨: 이미 링크룸에 참여한 친구입니다</li>
                  <li>• 거절됨: 초대를 거절한 친구입니다</li>
                </ul>
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-3 p-2 bg-red-50 rounded-md border border-red-200">
                  {error}
                </p>
              )}

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={inviting !== null}
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white border-2 border-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg
              className="w-8 h-8 text-amber-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            친구들을 초대해보세요
          </h3>
          <p className="text-amber-700 mb-6">
            링크룸에 친구들을 초대하여 함께 링크를 공유해보세요
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            <span>친구 초대하기</span>
          </button>
        </div>
      )}
    </div>
  );
};
