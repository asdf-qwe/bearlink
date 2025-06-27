"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  X,
  Trash2,
  AlertCircle,
  Loader2,
  Edit2,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { categoryService } from "@/features/category/service/categoryService";
import {
  Category,
  CategoryRequest,
} from "@/features/category/types/categoryTypes";

export default function Sidebar() {
  const { userInfo, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");

  // 마이페이지 여부 확인
  const isMyPage = pathname === "/main/myPage";

  // 아이콘 순서 배열 (meat, fish, box, beehive, wood 순서로 반복)
  const iconOrder = [
    "/free-icon-no-meat-5769766.png", // meat
    "/free-icon-fish-8047799.png", // fish
    "/free-icon-fruit-box-5836745.png", // box
    "/free-icon-beehive-9421133.png", // beehive
    "/free-icon-wood-12479254.png", // wood
  ];

  // 카테고리 인덱스에 따라 아이콘을 반환하는 함수
  const getCategoryIcon = (index: number): string => {
    return iconOrder[index % iconOrder.length];
  };

  // 백엔드에서 카테고리 목록 가져오기
  const fetchCategories = async () => {
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
  };
  // 컴포넌트 마운트 시 카테고리 목록 불러오기
  useEffect(() => {
    if (userInfo?.id) {
      fetchCategories();
    }
  }, [userInfo?.id]);

  // 카테고리 업데이트 이벤트 리스너 등록
  useEffect(() => {
    const handleCategoryUpdate = () => {
      if (userInfo?.id) {
        fetchCategories();
      }
    };

    window.addEventListener("categoryUpdated", handleCategoryUpdate);

    return () => {
      window.removeEventListener("categoryUpdated", handleCategoryUpdate);
    };
  }, [userInfo?.id]);

  const toggleSidebar = () => {
    // 토글 기능 제거됨
  };

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
    } catch (err) {
      console.error("카테고리 삭제 실패:", err);
      setError("카테고리 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 수정 모드 활성화
  const startEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setError(null);
  };

  // 카테고리 수정 취소
  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
    setError(null);
  };

  // 카테고리 수정 저장
  const saveEditCategory = async () => {
    if (!editingCategoryId || editingCategoryName.trim() === "") return;

    try {
      setLoading(true);
      setError(null);

      const categoryRequest: CategoryRequest = {
        name: editingCategoryName,
      };

      await categoryService.updateCategory(categoryRequest, editingCategoryId);
      await fetchCategories(); // 카테고리 목록 다시 불러오기
      setEditingCategoryId(null);
      setEditingCategoryName("");
    } catch (err) {
      console.error("카테고리 수정 실패:", err);
      setError("카테고리 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 수정 시 키 이벤트 처리
  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEditCategory();
    } else if (e.key === "Escape") {
      cancelEditCategory();
    }
  };

  const handleCategoryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addCategory();
    } else if (e.key === "Escape") {
      setShowAddCategoryForm(false);
    }
  };

  return (
    <div
      className="sidebar-container w-52 text-white transition-all duration-300 border-r border-stone-300 z-40 overflow-y-auto flex-shrink-0"
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
                  href="/main/myPage"
                  className="flex items-center space-x-3 p-3 border border-amber-200 rounded-md bg-amber-900 bg-opacity-30"
                >
                  <User size={20} className="text-amber-200" />
                  <span className="font-medium text-white">프로필</span>
                </Link>
                <button className="w-full flex items-center space-x-3 p-3 border border-amber-200 rounded-md hover:bg-amber-900 hover:bg-opacity-30 transition-colors">
                  <Settings size={20} className="text-amber-200" />
                  <span className="font-medium text-white">설정</span>
                </button>
                <Link
                  href="/main"
                  className="flex items-center space-x-3 p-3 border border-amber-200 rounded-md hover:bg-amber-900 hover:bg-opacity-30 transition-colors"
                >
                  <Plus size={20} className="text-amber-200" />
                  <span className="font-medium text-white">
                    링크룸으로 돌아가기
                  </span>
                </Link>
              </div>
            </>
          ) : (
            // 일반 페이지용 사이드바 (기존 코드)
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
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="flex justify-between items-center p-2 border border-amber-200 rounded-md hover:bg-amber-900 hover:bg-opacity-30 transition-colors group"
                  >
                    {editingCategoryId === category.id ? (
                      <div className="flex-grow mr-2">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) =>
                            setEditingCategoryName(e.target.value)
                          }
                          onKeyDown={handleEditKeyPress}
                          className="w-full p-1 bg-white rounded border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-500"
                          aria-label="카테고리 이름 수정"
                          autoFocus
                          disabled={loading}
                        />
                      </div>
                    ) : (
                      <Link
                        href={`/main/category/${category.id}`}
                        className="flex items-center space-x-3 flex-grow min-w-0"
                      >
                        <img
                          src={getCategoryIcon(index)}
                          alt={`카테고리 아이콘`}
                          className="w-5 h-5 object-contain flex-shrink-0"
                        />
                        <span className="font-medium text-white break-all word-break-all overflow-hidden">
                          {category.name}
                        </span>
                      </Link>
                    )}

                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingCategoryId === category.id ? (
                        <>
                          <button
                            onClick={saveEditCategory}
                            className="p-1 text-green-400 hover:text-green-600 transition-colors"
                            aria-label="저장"
                            disabled={loading}
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEditCategory}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                            aria-label="취소"
                            disabled={loading}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditCategory(category)}
                            className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                            aria-label={`${category.name} 카테고리 수정`}
                            disabled={loading}
                          >
                            <Edit2 size={16} />
                          </button>
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
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {!loading && categories.length === 0 && (
                  <p className="text-center text-amber-200 p-4">
                    카테고리가 없습니다. 새 카테고리를 추가해보세요!
                  </p>
                )}
              </div>
            </>
          )}
        </>
      </div>
    </div>
  );
}
