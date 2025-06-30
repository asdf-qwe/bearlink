"use client";
import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Star,
  User,
} from "lucide-react";
import { friendService } from "@/features/friend/service/friendService";
import { FriendResponseDto } from "@/features/friend/types/friend";

interface Friend {
  id: number;
  nickname: string;
  imageUrl?: string;
  isStarred: boolean;
}

interface FriendRequest {
  id: number;
  nickname: string;
  imageUrl?: string;
}

export default function FriendPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [userSearchResults, setUserSearchResults] = useState<
    FriendResponseDto[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userSearchKeyword, setUserSearchKeyword] = useState("");

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [friendsResponse, requestsResponse] = await Promise.all([
        friendService.getFriends().catch((err) => {
          console.error("친구 목록 조회 실패:", err);
          return [];
        }),
        friendService.getFriendRequests().catch((err) => {
          console.error("친구 신청 목록 조회 실패:", err);
          return [];
        }),
      ]);

      // 응답 데이터 안전성 검사
      const friendsData = Array.isArray(friendsResponse) ? friendsResponse : [];
      const requestsData = Array.isArray(requestsResponse)
        ? requestsResponse
        : [];

      // 백엔드 DTO를 프론트엔드 타입으로 변환
      const convertedFriends: Friend[] = friendsData.map((friend) => ({
        id: friend.id,
        nickname: friend.nickname || "",
        imageUrl: friend.imageUrl,
        isStarred: false, // 기본값
      }));

      const convertedRequests: FriendRequest[] = requestsData.map(
        (request) => ({
          id: request.id,
          nickname: request.nickname || "",
          imageUrl: request.imageUrl,
        })
      );

      setFriends(convertedFriends);
      setFriendRequests(convertedRequests);
    } catch (err) {
      console.error("데이터 로드 실패:", err);
      setError("데이터를 불러오는데 실패했습니다.");
      // 에러 발생 시 빈 배열로 초기화
      setFriends([]);
      setFriendRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = (friendId: number) => {
    setFriends(
      friends.map((friend) =>
        friend.id === friendId
          ? { ...friend, isStarred: !friend.isStarred }
          : friend
      )
    );
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await friendService.acceptFriendRequest(requestId);
      // 요청 목록에서 제거하고 친구 목록 새로고침
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
      await loadData(); // 전체 데이터 다시 로드
    } catch (err) {
      console.error("친구 신청 수락 실패:", err);
      setError("친구 신청 수락에 실패했습니다.");
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await friendService.rejectFriendRequest(requestId);
      // 요청 목록에서 제거
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error("친구 신청 거절 실패:", err);
      setError("친구 신청 거절에 실패했습니다.");
    }
  };

  // 사용자 검색 기능
  const handleSearchUsers = async (keyword: string) => {
    if (!keyword.trim()) {
      setUserSearchResults([]);
      return;
    }

    try {
      setUserSearchLoading(true);
      const response = await friendService.findFriends(keyword.trim());

      // 응답 구조 안전성 검사
      if (response && response.content && Array.isArray(response.content)) {
        setUserSearchResults(response.content);
      } else if (Array.isArray(response)) {
        // 응답이 직접 배열인 경우
        setUserSearchResults(response);
      } else {
        // 예상치 못한 응답 구조인 경우
        console.warn("예상치 못한 응답 구조:", response);
        setUserSearchResults([]);
      }
    } catch (err) {
      console.error("사용자 검색 실패:", err);
      setError("사용자 검색에 실패했습니다.");
      setUserSearchResults([]);
    } finally {
      setUserSearchLoading(false);
    }
  };

  // 친구 신청 보내기
  const handleSendFriendRequest = async (receiverId: number) => {
    try {
      console.log("친구 신청 대상 ID:", receiverId);
      console.log("전송할 데이터:", { receiverId });

      if (!receiverId) {
        throw new Error("유효하지 않은 사용자 ID입니다.");
      }

      await friendService.sendFriendRequest({ receiverId });
      // 검색 결과에서 해당 사용자 제거 (이미 신청했으므로)
      setUserSearchResults((prev) =>
        prev.filter((user) => user.id !== receiverId)
      );
      setError(null);
      alert("친구 신청을 보냈습니다.");
    } catch (err) {
      console.error("친구 신청 실패:", err);
      setError("친구 신청에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-amber-700">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">친구 관리</h1>
          <p className="text-amber-700">친구들과 링크를 공유하고 소통하세요.</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* 친구 요청 카드 */}
        {friendRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <UserPlus className="mr-2 text-amber-600" size={20} />
              친구 신청 ({friendRequests.length})
            </h2>

            <div className="space-y-3">
              {friendRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      {request.imageUrl ? (
                        <img
                          src={request.imageUrl}
                          alt={request.nickname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {request.nickname}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      수락
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm"
                    >
                      거절
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 사용자 검색 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <UserPlus className="mr-2 text-amber-600" size={20} />
            새로운 친구 찾기
          </h2>

          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="닉네임으로 사용자 검색..."
              value={userSearchKeyword}
              onChange={(e) => {
                setUserSearchKeyword(e.target.value);
                handleSearchUsers(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {userSearchLoading && (
            <div className="text-center py-4">
              <div className="text-gray-500">검색 중...</div>
            </div>
          )}

          {userSearchResults.length > 0 && (
            <div className="space-y-3">
              {userSearchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.nickname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {user.nickname}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendFriendRequest(user.id)}
                    className="flex items-center px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <UserPlus size={14} className="mr-1" />
                    친구 추가
                  </button>
                </div>
              ))}
            </div>
          )}

          {userSearchKeyword &&
            !userSearchLoading &&
            userSearchResults.length === 0 && (
              <div className="text-center py-4">
                <div className="text-gray-500">검색 결과가 없습니다.</div>
              </div>
            )}
        </div>

        {/* 친구 목록 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Users className="mr-2 text-amber-600" size={20} />
            친구 목록 ({friends.length})
          </h2>

          {friends.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">아직 친구가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      {friend.imageUrl ? (
                        <img
                          src={friend.imageUrl}
                          alt={friend.nickname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {friend.nickname}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStar(friend.id)}
                      className={`p-2 rounded ${
                        friend.isStarred
                          ? "text-yellow-500"
                          : "text-gray-400 hover:text-yellow-500"
                      }`}
                    >
                      <Star
                        size={16}
                        fill={friend.isStarred ? "currentColor" : "none"}
                      />
                    </button>

                    <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
