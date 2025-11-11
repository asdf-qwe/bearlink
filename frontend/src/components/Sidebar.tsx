"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  X,
  Trash2,
  AlertCircle,
  Loader2,
  User,
  LogOut,
  Users,
  Home,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { categoryService } from "@/features/category/service/categoryService";
import { roomService } from "@/features/room/service/roomService";
import {
  Category,
  CategoryRequest,
} from "@/features/category/types/categoryTypes";
import { CreateLinkRoomRequest, RoomsDto } from "@/features/room/type/room";

export default function Sidebar() {
  const { userInfo, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 개인/그룹 토글 상태 추가
  const [viewMode, setViewMode] = useState<"personal" | "group">("personal");
  // 링크룸 목록 상태 추가
  const [rooms, setRooms] = useState<RoomsDto[]>([]);
  const [roomLoading, setRoomLoading] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  // 마이페이지 여부 확인 - /main/myPage로 시작하는 경로에서 마이페이지 사이드바 표시
  const isMyPage = pathname.startsWith("/main/myPage");

  // 현재 선택된 카테고리 ID 추출
  const getCurrentCategoryId = (): number | null => {
    const match = pathname.match(/\/main\/category\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  // 현재 선택된 링크룸 ID 추출
  const getCurrentRoomId = (): number | null => {
    const match = pathname.match(/\/main\/room\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  const currentCategoryId = getCurrentCategoryId();
  const currentRoomId = getCurrentRoomId();

  // 아이콘 순서 배열 (meat, fish, box, beehive, wood 순서로 반복) - useMemo로 최적화
  const iconOrder = useMemo(
    () => [
      "/free-icon-no-meat-5769766.png", // meat
      "/free-icon-fish-8047799.png", // fish
      "/free-icon-fruit-box-5836745.png", // box
      "/free-icon-beehive-9421133.png", // beehive
      "/free-icon-wood-12479254.png", // wood
    ],
    []
  );

  // 카테고리 인덱스에 따라 아이콘을 반환하는 함수 - useCallback으로 최적화
  const getCategoryIcon = useCallback(
    (index: number): string => {
      return iconOrder[index % iconOrder.length];
    },
    [iconOrder]
  );

  // 백엔드에서 카테고리 목록 가져오기 - useCallback으로 최적화
  const fetchCategories = useCallback(async () => {
    if (!userInfo?.id) return;

    try {
      setLoading(true);
      setError(null);
      const categoriesData = await categoryService.getCategoriesByUserId(
        userInfo.id
      );
      setCategories(categoriesData);
    } catch (err) {
      console.error("카테고리 로딩 실패:", err);
      setError("카테고리를 불러오는데 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [userInfo?.id]);

  // 링크룸 목록 가져오기 - useCallback으로 최적화
  const fetchRooms = useCallback(async () => {
    if (!userInfo?.id) return;

    try {
      setRoomLoading(true);
      setRoomError(null);
      const roomsData = await roomService.getRooms();

      // 백엔드 응답에 id가 없을 경우 id를 추가
      const roomsWithId = roomsData.map((room: any, index: number) => {
        if (room.id === undefined) {
          return { ...room, id: room.roomId || index };
        }
        return room;
      });

      setRooms(roomsWithId);
    } catch (err) {
      console.error("링크룸 로딩 실패:", err);
      setRoomError("링크룸을 불러오는데 문제가 발생했습니다.");
    } finally {
      setRoomLoading(false);
    }
  }, [userInfo?.id]);

  // 컴포넌트 마운트 시 카테고리 및 링크룸 목록 불러오기
  useEffect(() => {
    if (userInfo?.id) {
      fetchCategories();
      fetchRooms();
    }
  }, [userInfo?.id, fetchCategories, fetchRooms]);

  // 뷰 모드 전환 함수 - useCallback으로 최적화
  const switchToPersonal = useCallback(() => {
    setViewMode("personal");
  }, []);

  const switchToGroup = useCallback(() => {
    setViewMode("group");
  }, []);

  // 메모이제이션된 이벤트 핸들러들
  const handleCategoryUpdate = useCallback(() => {
    if (userInfo?.id) {
      fetchCategories();
    }
  }, [userInfo?.id, fetchCategories]);

  const handleRoomUpdate = useCallback(() => {
    if (userInfo?.id) {
      fetchRooms();
    }
  }, [userInfo?.id, fetchRooms]);

  // 카테고리 업데이트 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener("categoryUpdated", handleCategoryUpdate);
    return () => {
      window.removeEventListener("categoryUpdated", handleCategoryUpdate);
    };
  }, [handleCategoryUpdate]);

  // 링크룸 업데이트 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener("roomUpdated", handleRoomUpdate);
    return () => {
      window.removeEventListener("roomUpdated", handleRoomUpdate);
    };
  }, [handleRoomUpdate]);

  const toggleSidebar = () => {
    // 토글 기능 제거됨
  };

  // 메모이제이션된 네비게이션 핸들러들
  const handlePersonalNavigation = useCallback(() => {
    switchToPersonal();
    if (categories.length > 0) {
      router.push(`/main/category/${categories[0].id}`);
    } else {
      router.push("/main/category");
    }
  }, [categories, router, switchToPersonal]);

  const handleGroupNavigation = useCallback(() => {
    switchToGroup();
    if (rooms.length > 0) {
      router.push(`/main/room/${rooms[0].id}`);
    } else {
      router.push("/main/room");
    }
  }, [rooms, router, switchToGroup]);

  // 아이콘 프리로딩
  useEffect(() => {
    iconOrder.forEach((iconPath) => {
      const img = new Image();
      img.src = iconPath;
    });
  }, [iconOrder]);

  const toggleAddCategoryForm = () => {
    setShowAddCategoryForm(!showAddCategoryForm);
    setNewCategoryName("");
  };
  const addCategory = async () => {
    if (newCategoryName.trim() === "" || !userInfo?.id) return;

    try {
      setLoading(true);
      setError(null);

      const categoryRequest: CategoryRequest = {
        name: newCategoryName,
      };

      await categoryService.createCategory(categoryRequest, userInfo.id);
      await fetchCategories(); // 카테고리 목록 다시 불러오기

      setNewCategoryName("");
      setShowAddCategoryForm(false);
    } catch (err) {
      console.error("카테고리 생성 실패:", err);
      setError("카테고리 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }; // 카테고리 삭제 기능
  const removeCategory = async (categoryId: number, categoryName: string) => {
    if (!confirm(`"${categoryName}" 카테고리를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await categoryService.deleteCategory(categoryId);
      await fetchCategories(); // 카테고리 목록 다시 불러오기

      // 카테고리 삭제 이벤트 발생
      window.dispatchEvent(
        new CustomEvent("categoryDeleted", {
          detail: { categoryId },
        })
      );
    } catch (err) {
      console.error("카테고리 삭제 실패:", err);
      setError("카테고리 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addCategory();
    } else if (e.key === "Escape") {
      setShowAddCategoryForm(false);
    }
  };

  // 링크룸 추가 폼 토글
  const toggleAddRoomForm = () => {
    setShowAddRoomForm(!showAddRoomForm);
    setNewRoomName("");
  };

  // 링크룸 추가 함수
  const addRoom = async () => {
    if (newRoomName.trim() === "") return;

    try {
      setRoomLoading(true);
      setRoomError(null);

      const roomRequest: CreateLinkRoomRequest = {
        name: newRoomName,
      };

      const createdRoom = await roomService.createRoom(roomRequest);

      // 링크룸 생성 후 이벤트 발생
      window.dispatchEvent(new CustomEvent("roomUpdated"));
      await fetchRooms(); // 링크룸 목록 다시 불러오기

      setNewRoomName("");
      setShowAddRoomForm(false);
    } catch (err) {
      console.error("링크룸 생성 실패:", err);
      setRoomError("링크룸 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setRoomLoading(false);
    }
  };

  // 링크룸 키보드 입력 처리
  const handleRoomKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addRoom();
    } else if (e.key === "Escape") {
      setShowAddRoomForm(false);
    }
  };

  // 컴포넌트 마운트 시 현재 경로에 따라 뷰 모드 설정
  useEffect(() => {
    if (pathname.startsWith("/main/room")) {
      setViewMode("group");
    } else if (pathname.startsWith("/main/category")) {
      setViewMode("personal");
    }
  }, [pathname]);

  return (
    <div
      className="sidebar-container w-64 bg-amber-25 border-r border-amber-100 transition-all duration-300 z-40 overflow-y-auto flex-shrink-0 shadow-sm"
      style={{ backgroundColor: "#fffdf7" }}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 flex-1">
          {isMyPage ? (
            // 마이페이지용 사이드바
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-amber-900">
                  마이페이지
                </h2>
                <p className="text-sm text-amber-700 mt-1">계정 관리</p>
              </div>
              <nav className="space-y-1">
                <Link
                  href="/main/myPage/friend"
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/main/myPage/friend"
                      ? "bg-amber-100 text-amber-800 border-l-4 border-amber-500"
                      : "text-amber-700 hover:bg-amber-100 hover:text-amber-900"
                  }`}
                >
                  <Users
                    size={18}
                    className={`mr-3 ${
                      pathname === "/main/myPage/friend"
                        ? "text-amber-700"
                        : "text-amber-500 group-hover:text-amber-700"
                    }`}
                  />
                  친구
                </Link>
              </nav>
            </>
          ) : (
            // 일반 페이지용 사이드바
            <>
              {/* 개인/그룹 토글 */}
              <div className="flex mb-6 bg-amber-100 rounded-lg p-1">
                <button
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                    viewMode === "personal"
                      ? "bg-white text-amber-900 shadow-sm"
                      : "text-amber-700 hover:text-amber-900 hover:bg-amber-50"
                  }`}
                  onClick={handlePersonalNavigation}
                >
                  <div className="flex items-center justify-center gap-2">
                    <User size={16} />
                    <span>개인</span>
                  </div>
                </button>
                <button
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                    viewMode === "group"
                      ? "bg-white text-amber-900 shadow-sm"
                      : "text-amber-700 hover:text-amber-900 hover:bg-amber-50"
                  }`}
                  onClick={handleGroupNavigation}
                >
                  <div className="flex items-center justify-center gap-2">
                    <UsersRound size={16} />
                    <span>그룹</span>
                  </div>
                </button>
              </div>

              {viewMode === "personal" ? (
                // 개인 링크 영역
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-amber-900">
                        저장공간
                      </h2>
                      <p className="text-sm text-amber-700">링크 카테고리</p>
                    </div>
                    <button
                      onClick={toggleAddCategoryForm}
                      className="p-2 text-amber-500 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                      aria-label="카테고리 추가"
                      disabled={loading}
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* 오류 메시지 */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* 로딩 표시 */}
                  {loading && (
                    <div className="flex justify-center my-4">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  )}

                  {/* 카테고리 추가 폼 */}
                  {showAddCategoryForm && (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={handleCategoryKeyPress}
                        placeholder="카테고리 이름을 입력하세요"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        autoFocus
                        disabled={loading}
                      />
                    </div>
                  )}
                  <nav className="space-y-1">
                    {categories.map((category, index) => {
                      const isSelected = currentCategoryId === category.id;

                      return (
                        <div
                          key={category.id}
                          className={`group flex items-center justify-between rounded-lg transition-colors ${
                            isSelected ? "bg-amber-100" : "hover:bg-amber-100"
                          }`}
                        >
                          <Link
                            href={`/main/category/${category.id}`}
                            className={`flex items-center gap-3 px-3 py-2.5 flex-1 min-w-0 text-sm font-medium transition-colors ${
                              isSelected
                                ? "text-amber-800 border-l-4 border-amber-500"
                                : "text-amber-700 hover:text-amber-900"
                            }`}
                          >
                            <img
                              src={getCategoryIcon(index)}
                              alt="카테고리 아이콘"
                              className="w-5 h-5 object-contain flex-shrink-0"
                            />
                            <span className="truncate">{category.name}</span>
                          </Link>

                          <button
                            onClick={() =>
                              removeCategory(category.id, category.name)
                            }
                            className="opacity-0 group-hover:opacity-100 p-1.5 mr-2 text-amber-400 hover:text-red-500 rounded transition-all"
                            aria-label={`${category.name} 삭제`}
                            disabled={loading}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}

                    {!loading && categories.length === 0 && (
                      <div className="text-center py-8">
                        <div className="text-stone-400 mb-2">
                          <Home size={24} className="mx-auto" />
                        </div>
                        <p className="text-sm text-stone-500">
                          카테고리가 없습니다
                        </p>
                        <p className="text-xs text-stone-400 mt-1">
                          새 카테고리를 추가해보세요
                        </p>
                      </div>
                    )}
                  </nav>
                </>
              ) : (
                // 링크룸 영역
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-stone-800">
                        링크룸
                      </h2>
                      <p className="text-sm text-stone-600">공유 공간</p>
                    </div>
                    <button
                      onClick={toggleAddRoomForm}
                      className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                      aria-label="링크룸 추가"
                      disabled={roomLoading}
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* 오류 메시지 */}
                  {roomError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      <span>{roomError}</span>
                    </div>
                  )}

                  {/* 로딩 표시 */}
                  {roomLoading && (
                    <div className="flex justify-center my-4">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  )}

                  {/* 링크룸 추가 폼 */}
                  {showAddRoomForm && (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        onKeyDown={handleRoomKeyPress}
                        placeholder="링크룸 이름을 입력하세요"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        autoFocus
                        disabled={roomLoading}
                      />
                    </div>
                  )}

                  {/* 링크룸 목록 */}
                  <nav className="space-y-1">
                    {rooms.length > 0 ? (
                      rooms.map((room, index) => {
                        const roomId = room.id !== undefined ? room.id : index;
                        const isSelected = currentRoomId === roomId;
                        return (
                          <div
                            key={roomId}
                            className={`group flex items-center justify-between rounded-lg transition-colors ${
                              isSelected ? "bg-amber-100" : "hover:bg-stone-100"
                            }`}
                          >
                            <Link
                              href={`/main/room/${roomId}`}
                              className={`flex items-center gap-3 px-3 py-2.5 flex-1 min-w-0 text-sm font-medium transition-colors ${
                                isSelected
                                  ? "text-amber-800 border-l-4 border-amber-500"
                                  : "text-stone-700 hover:text-stone-900"
                              }`}
                            >
                              <UsersRound
                                size={18}
                                className={`flex-shrink-0 ${
                                  isSelected
                                    ? "text-amber-600"
                                    : "text-stone-400"
                                }`}
                              />
                              <span className="truncate">{room.name}</span>
                            </Link>

                            <button
                              onClick={async () => {
                                if (
                                  !confirm(
                                    `"${room.name}" 링크룸을 삭제하시겠습니까?`
                                  )
                                )
                                  return;
                                try {
                                  setRoomLoading(true);
                                  setRoomError(null);
                                  await roomService.deleteRoom(roomId);
                                  window.dispatchEvent(
                                    new CustomEvent("roomUpdated")
                                  );
                                  await fetchRooms();
                                  router.push("/main/room");
                                } catch (err) {
                                  console.error("링크룸 삭제 실패:", err);
                                  setRoomError("링크룸 삭제에 실패했습니다.");
                                } finally {
                                  setRoomLoading(false);
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 mr-2 text-stone-400 hover:text-red-500 rounded transition-all"
                              aria-label={`${room.name} 삭제`}
                              disabled={roomLoading}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-stone-400 mb-2">
                          <UsersRound size={24} className="mx-auto" />
                        </div>
                        <p className="text-sm text-stone-500">
                          참여 중인 링크룸이 없습니다
                        </p>
                        <p className="text-xs text-stone-400 mt-1">
                          새 링크룸을 만들어보세요
                        </p>
                      </div>
                    )}
                  </nav>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
