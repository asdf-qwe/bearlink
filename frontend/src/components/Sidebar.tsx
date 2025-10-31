"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  X,
  Trash2,
  AlertCircle,
  Loader2,
  User,
  Settings,
  LogOut,
  CreditCard,
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
      className="sidebar-container w-44 text-white transition-all duration-300 border-r border-stone-300 z-40 overflow-y-auto flex-shrink-0"
      style={{ backgroundColor: "#907761" }}
    >
      <div className="p-3">
        <>
          {isMyPage ? (
            // 마이페이지용 사이드바
            <>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white">마이페이지</h2>
              </div>
              <div className="space-y-3">
                <Link
                  href="/main/myPage/profile"
                  className={`flex items-center space-x-3 p-3 border rounded-md transition-colors ${
                    pathname === "/main/myPage/profile"
                      ? "border-amber-300 bg-amber-900 bg-opacity-50 shadow-lg"
                      : "border-amber-200 hover:bg-amber-900 hover:bg-opacity-30"
                  }`}
                >
                  <User size={20} className="text-amber-200" />
                  <span
                    className={`font-medium ${
                      pathname === "/main/myPage/profile"
                        ? "text-amber-100 font-semibold"
                        : "text-white"
                    }`}
                  >
                    프로필
                  </span>
                </Link>
                <Link
                  href="/main/myPage/account"
                  className={`flex items-center space-x-3 p-3 border rounded-md transition-colors ${
                    pathname === "/main/myPage/account"
                      ? "border-amber-300 bg-amber-900 bg-opacity-50 shadow-lg"
                      : "border-amber-200 hover:bg-amber-900 hover:bg-opacity-30"
                  }`}
                >
                  <CreditCard size={20} className="text-amber-200" />
                  <span
                    className={`font-medium ${
                      pathname === "/main/myPage/account"
                        ? "text-amber-100 font-semibold"
                        : "text-white"
                    }`}
                  >
                    계정
                  </span>
                </Link>
                <Link
                  href="/main/myPage/friend"
                  className={`flex items-center space-x-3 p-3 border rounded-md transition-colors ${
                    pathname === "/main/myPage/friend"
                      ? "border-amber-300 bg-amber-900 bg-opacity-50 shadow-lg"
                      : "border-amber-200 hover:bg-amber-900 hover:bg-opacity-30"
                  }`}
                >
                  <Users size={20} className="text-amber-200" />
                  <span
                    className={`font-medium ${
                      pathname === "/main/myPage/friend"
                        ? "text-amber-100 font-semibold"
                        : "text-white"
                    }`}
                  >
                    친구
                  </span>
                </Link>
                <Link
                  href="/main/myPage/settings"
                  className={`flex items-center space-x-3 p-3 border rounded-md transition-colors ${
                    pathname === "/main/myPage/settings"
                      ? "border-amber-300 bg-amber-900 bg-opacity-50 shadow-lg"
                      : "border-amber-200 hover:bg-amber-900 hover:bg-opacity-30"
                  }`}
                >
                  <Settings size={20} className="text-amber-200" />
                  <span
                    className={`font-medium ${
                      pathname === "/main/myPage/settings"
                        ? "text-amber-100 font-semibold"
                        : "text-white"
                    }`}
                  >
                    설정
                  </span>
                </Link>
              </div>
            </>
          ) : (
            // 일반 페이지용 사이드바
            <>
              {/* 개인/그룹 토글 추가 */}
              <div className="flex mb-4 border border-amber-200 rounded-md overflow-hidden">
                <button
                  className={`flex-1 py-2 px-1 text-center transition-colors ${
                    viewMode === "personal"
                      ? "bg-amber-900 bg-opacity-50 text-amber-100 font-semibold"
                      : "hover:bg-amber-900 hover:bg-opacity-30"
                  }`}
                  onClick={handlePersonalNavigation}
                >
                  <div className="flex items-center justify-center">
                    <User size={16} className="mr-1" />
                    <span>개인</span>
                  </div>
                </button>
                <button
                  className={`flex-1 py-2 px-1 text-center transition-colors ${
                    viewMode === "group"
                      ? "bg-amber-900 bg-opacity-50 text-amber-100 font-semibold"
                      : "hover:bg-amber-900 hover:bg-opacity-30"
                  }`}
                  onClick={handleGroupNavigation}
                >
                  <div className="flex items-center justify-center">
                    <UsersRound size={16} className="mr-1" />
                    <span>그룹</span>
                  </div>
                </button>
              </div>

              {viewMode === "personal" ? (
                // 개인 링크룸 영역
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">저장공간</h2>
                    <button
                      onClick={toggleAddCategoryForm}
                      className="p-1 bg-stone-600 hover:bg-stone-700 text-white rounded-full transition-colors"
                      aria-label="카테고리 추가 폼 열기"
                      disabled={loading}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {/* 오류 메시지 표시 */}
                  {error && (
                    <div className="mb-2 p-2 bg-red-100 border border-red-400 rounded text-red-700 text-sm flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      <span>{error}</span>
                    </div>
                  )}
                  {/* 로딩 표시 */}
                  {loading && (
                    <div className="flex justify-center my-2">
                      <Loader2 className="h-5 w-5 animate-spin text-amber-200" />
                    </div>
                  )}
                  {showAddCategoryForm && (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={handleCategoryKeyPress}
                        placeholder="새 카테고리 이름 입력 후 Enter"
                        className="w-full p-2 bg-white rounded border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                        aria-label="새 카테고리 이름 입력"
                        autoFocus
                        disabled={loading}
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    {categories.map((category, index) => {
                      const isSelected = currentCategoryId === category.id;

                      return (
                        <div
                          key={category.id}
                          className={`flex justify-between items-center p-2 border rounded-md transition-colors group ${
                            isSelected
                              ? "border-amber-300 bg-amber-900 bg-opacity-50 shadow-lg"
                              : "border-amber-200 hover:bg-amber-900 hover:bg-opacity-30"
                          }`}
                        >
                          <Link
                            href={`/main/category/${category.id}`}
                            className="flex items-center space-x-3 flex-grow min-w-0"
                          >
                            <img
                              src={getCategoryIcon(index)}
                              alt={`카테고리 아이콘`}
                              className="w-5 h-5 object-contain flex-shrink-0"
                            />
                            <span
                              className={`font-medium break-all word-break-all overflow-hidden ${
                                isSelected
                                  ? "text-amber-100 font-semibold"
                                  : "text-white"
                              }`}
                            >
                              {category.name}
                            </span>
                          </Link>

                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() =>
                                removeCategory(category.id, category.name)
                              }
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              aria-label={`${category.name} 카테고리 삭제`}
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {!loading && categories.length === 0 && (
                      <p className="text-center text-amber-200 p-4">
                        카테고리가 없습니다. 새 카테고리를 추가해보세요!
                      </p>
                    )}
                  </div>
                </>
              ) : (
                // 링크룸 영역
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">링크룸</h2>
                    <button
                      onClick={toggleAddRoomForm}
                      className="p-1 bg-stone-600 hover:bg-stone-700 text-white rounded-full transition-colors"
                      aria-label="링크룸 추가 폼 열기"
                      disabled={roomLoading}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* 오류 메시지 표시 */}
                  {roomError && (
                    <div className="mb-2 p-2 bg-red-100 border border-red-400 rounded text-red-700 text-sm flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      <span>{roomError}</span>
                    </div>
                  )}

                  {/* 로딩 표시 */}
                  {roomLoading && (
                    <div className="flex justify-center my-2">
                      <Loader2 className="h-5 w-5 animate-spin text-amber-200" />
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
                        placeholder="새 링크룸 이름 입력 후 Enter"
                        className="w-full p-2 bg-white rounded border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                        aria-label="새 링크룸 이름 입력"
                        autoFocus
                        disabled={roomLoading}
                      />
                    </div>
                  )}

                  {/* 링크룸 목록 */}
                  <div className="space-y-3">
                    {rooms.length > 0 ? (
                      rooms.map((room, index) => {
                        const roomId = room.id !== undefined ? room.id : index;
                        const isSelected = currentRoomId === roomId;
                        return (
                          <div
                            key={roomId}
                            className={`flex justify-between items-center p-2 border rounded-md transition-colors group ${
                              isSelected
                                ? "border-amber-300 bg-amber-900 bg-opacity-50 shadow-lg"
                                : "border-amber-200 hover:bg-amber-900 hover:bg-opacity-30"
                            }`}
                          >
                            <Link
                              href={`/main/room/${roomId}`}
                              className="flex items-center space-x-3 flex-grow min-w-0"
                            >
                              <UsersRound
                                size={20}
                                className="text-amber-200 flex-shrink-0"
                              />
                              <span
                                className={`font-medium break-all word-break-all overflow-hidden ${
                                  isSelected
                                    ? "text-amber-100 font-semibold"
                                    : "text-white"
                                }`}
                              >
                                {room.name}
                              </span>
                            </Link>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                aria-label={`${room.name} 링크룸 삭제`}
                                disabled={roomLoading}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-amber-200 p-4">
                        참여 중인 링크룸이 없습니다. 새 링크룸을 만들어보세요!
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
}
