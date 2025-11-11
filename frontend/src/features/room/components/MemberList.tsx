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
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-white border-2 border-amber-600 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-amber-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-amber-900">
          멤버 목록 ({members.length}명)
        </h2>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white border-2 border-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-amber-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
          </div>
          <p className="text-amber-700">아직 멤버가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedMembers.map((member) => (
            <div
              key={member.userId}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                member.userId === currentUserId
                  ? "bg-amber-50 border-amber-600 shadow-md"
                  : "bg-white border-amber-200 hover:border-amber-600 hover:bg-amber-50"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-amber-700 flex items-center justify-center overflow-hidden shadow-sm">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={member.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {member.username.substring(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {member.role === "OWNER" && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21-.899-.353-1.835-.353-2.773a3.429 3.429 0 00-.775-.743zm7 5.187a.75.75 0 01-.364.613 28.272 28.272 0 01-4.272 0 .75.75 0 01-.364-.613l-.001-.358a29.115 29.115 0 012.5.001l.001.357z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-amber-900">
                      {member.username}
                    </h3>
                    {member.userId === currentUserId && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        나
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.role === "OWNER"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {member.role === "OWNER" ? "방장" : "멤버"}
                    </span>

                    {member.status === "PENDING" && (
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                        대기중
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
