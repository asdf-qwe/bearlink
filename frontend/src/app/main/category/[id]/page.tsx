"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Plus,
  LinkIcon,
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { categoryService } from "@/features/category/service/categoryService";
import { Category } from "@/features/category/types/categoryTypes";

interface LinkItem {
  id: string;
  title: string;
  url: string;
}

interface CategoryWithLinks {
  id: number;
  name: string;
  links: LinkItem[];
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { userInfo } = useAuth();
  const categoryId = Number(params.id as string);

  const [category, setCategory] = useState<CategoryWithLinks | null>(null);
  const [newLinkData, setNewLinkData] = useState({ title: "", url: "" });
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 백엔드에서 카테고리 정보 불러오기
  useEffect(() => {
    const loadCategory = async () => {
      if (!userInfo?.id) return;

      try {
        setLoading(true);
        setError(null);

        // 사용자의 모든 카테고리를 가져와서 현재 카테고리 찾기
        const categories = await categoryService.getCategoriesByUserId(
          userInfo.id
        );
        const currentCategory = categories.find((cat) => cat.id === categoryId);

        if (currentCategory) {
          // 백엔드 카테고리를 로컬 타입으로 변환
          const categoryWithLinks: CategoryWithLinks = {
            id: currentCategory.id,
            name: currentCategory.name,
            links: [], // 링크는 로컬 스토리지에서 가져옴 (임시)
          };

          setCategory(categoryWithLinks);
          setCategoryName(currentCategory.name);

          // 로컬 스토리지에서 링크 데이터 불러오기 (임시)
          const savedLinks = localStorage.getItem(
            `category_${categoryId}_links`
          );
          if (savedLinks) {
            const links = JSON.parse(savedLinks);
            categoryWithLinks.links = links;
            setCategory(categoryWithLinks);
          }
        } else {
          setError("카테고리를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("카테고리 로딩 실패:", err);
        setError("카테고리를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryId, userInfo?.id]);

  const addLink = () => {
    if (
      !category ||
      newLinkData.title.trim() === "" ||
      newLinkData.url.trim() === ""
    )
      return;

    let url = newLinkData.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: newLinkData.title,
      url: url,
    };

    const updatedCategory = {
      ...category,
      links: [...category.links, newLink],
    };

    setCategory(updatedCategory);
    setNewLinkData({ title: "", url: "" });
    setShowAddLinkForm(false);

    // 로컬 스토리지에 저장 (임시 - 나중에 백엔드 API로 변경)
    localStorage.setItem(
      `category_${categoryId}_links`,
      JSON.stringify(updatedCategory.links)
    );
  };

  const removeLink = (linkId: string) => {
    if (!category) return;

    const updatedCategory = {
      ...category,
      links: category.links.filter((link) => link.id !== linkId),
    };

    setCategory(updatedCategory);

    // 로컬 스토리지에 저장 (임시 - 나중에 백엔드 API로 변경)
    localStorage.setItem(
      `category_${categoryId}_links`,
      JSON.stringify(updatedCategory.links)
    );
  };

  const saveCategoryName = () => {
    if (!category || categoryName.trim() === "") return;

    const updatedCategory = {
      ...category,
      name: categoryName,
    };

    setCategory(updatedCategory);
    setEditingCategory(false);

    // TODO: 백엔드 API로 카테고리 이름 업데이트
    console.log("카테고리 이름 업데이트:", categoryName);
  };

  const handleLinkKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addLink();
    } else if (e.key === "Escape") {
      setShowAddLinkForm(false);
      setNewLinkData({ title: "", url: "" });
    }
  };

  const handleCategoryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveCategoryName();
    } else if (e.key === "Escape") {
      setEditingCategory(false);
      setCategoryName(category?.name || "");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <span className="text-amber-700 text-lg">
            카테고리를 불러오는 중...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
        <button
          onClick={() => router.back()}
          className="flex items-center text-amber-700 hover:text-amber-900 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          뒤로 가기
        </button>
        <div className="bg-red-100 border border-red-400 rounded p-4 flex items-center">
          <AlertCircle size={20} className="text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
        <button
          onClick={() => router.back()}
          className="flex items-center text-amber-700 hover:text-amber-900 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          뒤로 가기
        </button>
        <div className="text-center text-amber-700">
          <p>카테고리를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
      {/* 뒤로 가기 버튼 */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-amber-700 hover:text-amber-900 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        뒤로 가기
      </button>      {/* 카테고리 제목 */}
      <div className="flex items-center space-x-3 mb-8">
        {editingCategory ? (
          <>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyDown={handleCategoryKeyPress}
              className="text-3xl font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={saveCategoryName}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                저장
              </button>
              <button
                onClick={() => {
                  setEditingCategory(false);
                  setCategoryName(category.name);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-amber-900">
              {category.name}
            </h1>
            <button
              onClick={() => setEditingCategory(true)}
              className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded"
              aria-label="카테고리 이름 편집"
            >
              <Edit size={20} />
            </button>
          </>
        )}
      </div>

      {/* 링크 추가 폼 */}
      {showAddLinkForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">
            새 링크 추가
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">
                제목
              </label>
              <input
                type="text"
                value={newLinkData.title}
                onChange={(e) =>
                  setNewLinkData({ ...newLinkData, title: e.target.value })
                }
                onKeyDown={handleLinkKeyPress}
                placeholder="링크 제목을 입력하세요"
                className="w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={newLinkData.url}
                onChange={(e) =>
                  setNewLinkData({ ...newLinkData, url: e.target.value })
                }
                onKeyDown={handleLinkKeyPress}
                placeholder="https://example.com"
                className="w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addLink}
                disabled={!newLinkData.title.trim() || !newLinkData.url.trim()}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                추가
              </button>
              <button
                onClick={() => {
                  setShowAddLinkForm(false);
                  setNewLinkData({ title: "", url: "" });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 링크 추가 버튼 */}
      {!showAddLinkForm && (
        <button
          onClick={() => setShowAddLinkForm(true)}
          className="flex items-center space-x-2 mb-6 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus size={20} />
          <span>새 링크 추가</span>
        </button>
      )}

      {/* 링크 목록 */}
      <div className="space-y-4">
        {category.links.length > 0 ? (
          category.links.map((link) => (
            <div
              key={link.id}
              className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center group hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3 flex-grow">
                <LinkIcon size={20} className="text-amber-600 flex-shrink-0" />
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-amber-900 truncate">
                    {link.title}
                  </h3>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-amber-600 hover:text-amber-800 hover:underline truncate block"
                  >
                    {link.url}
                  </a>
                </div>
              </div>
              <button
                onClick={() => removeLink(link.id)}
                className="p-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`${link.title} 링크 삭제`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <LinkIcon size={48} className="text-amber-300 mx-auto mb-4" />
            <p className="text-amber-600">첫 번째 링크를 추가해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
