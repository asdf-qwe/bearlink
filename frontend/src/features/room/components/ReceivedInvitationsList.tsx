import React from "react";
import { InvitationResponse } from "@/features/room/type/room";

interface ReceivedInvitationsListProps {
  invitations: InvitationResponse[];
  loading: boolean;
  onAccept: (roomMemberId: number) => Promise<boolean | void | undefined>;
  onDecline: (roomMemberId: number) => Promise<boolean | void | undefined>;
  error?: string | null;
}

/**
 * 사용자가 받은 초대 목록을 표시하는 컴포넌트
 */
export const ReceivedInvitationsList: React.FC<
  ReceivedInvitationsListProps & { onRefresh?: () => void }
> = ({ invitations, loading, onAccept, onDecline, error, onRefresh }) => {
  // 비어있는 경우에도 상태를 표시함
  if (invitations.length === 0 && !loading && !error) {
    return (
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">받은 초대</h2>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-2 py-1 text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md transition flex items-center"
              title="초대 목록 새로고침"
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
              새로고침
            </button>
          )}
        </div>
        <p className="text-gray-500 text-sm py-2">현재 받은 초대가 없습니다.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-bold text-gray-800 mb-2">받은 초대</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
          <span className="ml-2 text-gray-600">초대 목록을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-bold text-gray-800 mb-2">받은 초대</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">받은 초대</h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-2 py-1 text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md transition flex items-center"
            title="초대 목록 새로고침"
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
            새로고침
          </button>
        )}
      </div>

      {invitations.map((invitation) => (
        <div
          key={invitation.roomMemberId}
          className="mb-4 p-3 border border-amber-200 rounded-md bg-amber-50 flex flex-col sm:flex-row sm:items-center justify-between"
        >
          <div className="mb-2 sm:mb-0">
            <p className="font-medium text-gray-800">
              링크룸 #{invitation.roomId}
            </p>
            <p className="text-sm text-gray-600">새로운 초대가 있습니다</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onAccept(invitation.roomMemberId)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-sm transition"
            >
              수락
            </button>
            <button
              onClick={() => onDecline(invitation.roomMemberId)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm transition"
            >
              거절
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReceivedInvitationsList;
