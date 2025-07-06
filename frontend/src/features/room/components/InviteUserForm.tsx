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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {showForm ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">친구 초대하기</h2>
            <button
              type="button"
              onClick={() => {
                onRefresh();
              }}
              className="px-2 py-1 text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md transition flex items-center"
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
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
              <span className="ml-2 text-amber-700">
                친구 목록을 불러오는 중...
              </span>
            </div>
          ) : invitableFriends.length === 0 ? (
            <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-md bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="font-medium">초대할 수 있는 친구가 없습니다.</p>
              <p className="text-sm mt-2">친구 추가 후 다시 시도해주세요.</p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {invitableFriends.map((friend) => {
                    const statusBadge = getStatusBadge(friend.invitationStatus);
                    const isInvitable = canInviteFriend(
                      friend.invitationStatus
                    );
                    const isInviting = inviting === friend.userId;

                    return (
                      <div
                        key={friend.userId}
                        className={`border rounded-md p-3 flex flex-col ${
                          isInvitable
                            ? "border-amber-200 bg-amber-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium block">
                              {friend.nickname}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {friend.email}
                            </span>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${statusBadge.color}`}
                          >
                            {statusBadge.text}
                          </span>
                        </div>
                        {isInvitable && (
                          <button
                            type="button"
                            onClick={() => handleInvite(friend.userId)}
                            disabled={isInviting || loadingFriends}
                            className={`mt-2 py-1 px-3 text-sm rounded-md transition-colors ${
                              isInviting || loadingFriends
                                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                                : "bg-amber-500 hover:bg-amber-600 text-white"
                            }`}
                          >
                            {isInviting ? "초대중..." : "초대하기"}
                          </button>
                        )}
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
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 flex items-center justify-center bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
            <path d="M16 8a2 2 0 10-4 0v1h4V8z" />
          </svg>
          친구 초대하기
        </button>
      )}
    </div>
  );
};
