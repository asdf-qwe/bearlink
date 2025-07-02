import React from "react";
import { RoomMember } from "../type/roomPageTypes";

interface MemberListProps {
  members: RoomMember[];
  currentUserId?: number;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  currentUserId,
}) => {
  // 멤버를 역할(OWNER, MEMBER)별로 정렬
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === "OWNER" && b.role !== "OWNER") return -1;
    if (a.role !== "OWNER" && b.role === "OWNER") return 1;
    return 0;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">멤버 ({members.length}명)</h2>

      <div className="space-y-4">
        {sortedMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center mr-3 overflow-hidden">
                {member.profileImage ? (
                  <img
                    src={member.profileImage}
                    alt={member.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-amber-800 font-bold">
                    {member.username.substring(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium">
                  {member.username}
                  {member.userId === currentUserId && (
                    <span className="ml-2 text-gray-500 text-sm">(나)</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {member.role === "OWNER" ? "방장" : "멤버"}
                  {" · "}
                  {member.status === "PENDING"
                    ? "초대 대기중"
                    : member.status === "ACCEPTED"
                    ? "참여중"
                    : "초대 거절"}
                </div>
              </div>
            </div>

            {member.status === "PENDING" && (
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                대기중
              </span>
            )}
          </div>
        ))}

        {members.length === 0 && (
          <div className="text-center py-8 text-gray-500">멤버가 없습니다</div>
        )}
      </div>
    </div>
  );
};
