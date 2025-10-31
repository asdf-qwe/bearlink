import React from "react";
import { RoomInviteListDto, InvitationStatus } from "@/features/room/type/room";
import { roomService } from "@/features/room/service/roomService";

interface InvitationsListProps {
  invitations: RoomInviteListDto[];
  loading: boolean;
  onRefresh: () => void;
}

export const InvitationsList: React.FC<InvitationsListProps> = ({
  invitations,
  loading,
  onRefresh,
}) => {
  const handleAcceptInvitation = async (id: number) => {
    try {
      await roomService.acceptInvitation(id);
      onRefresh();
    } catch (error) {}
  };

  const handleDeclineInvitation = async (id: number) => {
    try {
      await roomService.declineInvitation(id);
      onRefresh();
    } catch (error) {}
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">받은 초대 목록</h2>
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">받은 초대 목록</h2>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">받은 초대가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">받은 초대 목록</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {invitations.map((invitation) => (
            <li
              key={invitation.id}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                {invitation.imageUrl ? (
                  <img
                    src={invitation.imageUrl}
                    alt={invitation.nickname}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 bg-amber-200 rounded-full mr-3 flex items-center justify-center">
                    <span className="text-amber-800 font-bold">
                      {invitation.nickname[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{invitation.nickname}</p>
                  <p className="text-sm text-gray-500">
                    상태:{" "}
                    {invitation.status === InvitationStatus.INVITED
                      ? "초대됨"
                      : invitation.status === InvitationStatus.ACCEPTED
                      ? "수락됨"
                      : "거절됨"}
                  </p>
                </div>
              </div>

              {invitation.status === InvitationStatus.INVITED && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAcceptInvitation(invitation.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    수락
                  </button>
                  <button
                    onClick={() => handleDeclineInvitation(invitation.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    거절
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
