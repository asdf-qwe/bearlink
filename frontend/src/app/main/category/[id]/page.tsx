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
import { linkService } from "@/features/link/service/linkService";
import { LinkRequestDto, LinkResponseDto } from "@/features/link/types/link";

interface LinkItem {
  id: number; // 백엔드 ID를 직접 사용
  title: string;
  url: string;
  thumbnailImageUrl?: string;
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
  const [extractingThumbnail, setExtractingThumbnail] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingLink, setAddingLink] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState<number | null>(null);
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
          // 백엔드에서 링크 목록 가져오기
          const backendLinks = await linkService.getLinks(
            userInfo.id,
            categoryId
          ); // 백엔드 LinkResponseDto를 로컬 LinkItem 타입으로 변환
          const convertedLinks: LinkItem[] = backendLinks.map((link) => ({
            id: link.id, // 백엔드 ID를 직접 사용
            title: link.title,
            url: link.url,
            thumbnailImageUrl: link.thumbnailImageUrl,
          }));

          // 백엔드 카테고리를 로컬 타입으로 변환
          const categoryWithLinks: CategoryWithLinks = {
            id: currentCategory.id,
            name: currentCategory.name,
            links: convertedLinks,
          };

          setCategory(categoryWithLinks);
          setCategoryName(currentCategory.name);

          // 백엔드에서 가져온 링크들을 로컬 스토리지에도 저장 (동기화용)
          localStorage.setItem(
            `category_${categoryId}_links`,
            JSON.stringify(convertedLinks)
          );
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
  // URL 입력 시 링크 미리보기 자동 추출
  const handleUrlChange = async (url: string) => {
    setNewLinkData((prev) => ({ ...prev, url }));
    setError(null);

    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      setExtractingThumbnail(true);
      try {
        const preview = await linkService.getLinkPreview(url);
        if (preview) {
          // 제목이 비어있으면 미리보기에서 가져온 제목 사용
          if (!newLinkData.title.trim() && preview.title) {
            setNewLinkData((prev) => ({ ...prev, title: preview.title }));
          }
          // 썸네일 설정
          setThumbnailUrl(preview.thumbnailImageUrl || "");
          console.log("링크 미리보기 추출 성공:", preview);
        } else {
          setThumbnailUrl("");
          console.log("링크 미리보기를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("링크 미리보기 추출 실패:", error);
        setThumbnailUrl("");
      } finally {
        setExtractingThumbnail(false);
      }
    } else {
      setThumbnailUrl("");
    }
  };
  const addLink = async () => {
    if (
      !category ||
      !userInfo?.id ||
      newLinkData.title.trim() === "" ||
      newLinkData.url.trim() === ""
    )
      return;

    let url = newLinkData.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    setAddingLink(true);
    setError(null);

    try {
      // 백엔드 API로 링크 생성
      const linkRequestDto: LinkRequestDto = {
        title: newLinkData.title,
        url: url,
        thumbnailImageUrl: thumbnailUrl, // 추출된 썸네일 URL 사용
      };
      await linkService.createLink(userInfo.id, category.id, linkRequestDto); // 성공 시 백엔드에서 최신 링크 목록 다시 가져오기
      const updatedLinks = await linkService.getLinks(userInfo.id, category.id);
      const convertedLinks: LinkItem[] = updatedLinks.map((link) => ({
        id: link.id, // 백엔드 ID를 직접 사용
        title: link.title,
        url: link.url,
        thumbnailImageUrl: link.thumbnailImageUrl,
      }));

      const updatedCategory = {
        ...category,
        links: convertedLinks,
      };
      setCategory(updatedCategory);
      setNewLinkData({ title: "", url: "" });
      setThumbnailUrl("");
      setShowAddLinkForm(false);

      // 로컬 스토리지에도 업데이트된 링크 목록 저장
      localStorage.setItem(
        `category_${categoryId}_links`,
        JSON.stringify(convertedLinks)
      );
    } catch (error) {
      console.error("링크 생성 실패:", error);
      // 에러 처리 - 사용자에게 알림
      setError("링크 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setAddingLink(false);
    }
  };
  const removeLink = async (linkId: number) => {
    if (!category || !userInfo?.id) return;

    // 삭제 확인 메시지
    const linkToDelete = category.links.find((link) => link.id === linkId);
    const confirmMessage = linkToDelete
      ? `"${linkToDelete.title}" 링크를 삭제하시겠습니까?`
      : "이 링크를 삭제하시겠습니까?";

    if (!window.confirm(confirmMessage)) {
      return; // 사용자가 취소를 누른 경우 삭제하지 않음
    }

    setDeletingLinkId(linkId);
    setError(null);

    try {
      // 백엔드 API로 링크 삭제
      await linkService.deleteLink(linkId);

      // 성공 시 로컬 상태에서도 제거
      const updatedCategory = {
        ...category,
        links: category.links.filter((link) => link.id !== linkId),
      };

      setCategory(updatedCategory);

      // 로컬 스토리지도 업데이트
      localStorage.setItem(
        `category_${categoryId}_links`,
        JSON.stringify(updatedCategory.links)
      );
    } catch (error) {
      console.error("링크 삭제 실패:", error);
      setError("링크 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDeletingLinkId(null);
    }
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
      </button>{" "}
      {/* 카테고리 제목 */}
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
      </div>{" "}
      {/* 링크 추가 폼 */}
      {showAddLinkForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">
            새 링크 추가
          </h3>

          {/* 에러 메시지 표시 */}
          {error && (
            <div className="bg-red-100 border border-red-400 rounded p-3 mb-4 flex items-center">
              <AlertCircle size={16} className="text-red-600 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">
                제목
              </label>{" "}
              <input
                type="text"
                value={newLinkData.title}
                onChange={(e) => {
                  setNewLinkData({ ...newLinkData, title: e.target.value });
                  setError(null);
                }}
                onKeyDown={handleLinkKeyPress}
                placeholder="링크 제목을 입력하세요"
                className="w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">
                URL
              </label>{" "}
              <input
                type="url"
                value={newLinkData.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onKeyDown={handleLinkKeyPress}
                placeholder="https://example.com"
                className="w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={addingLink || extractingThumbnail}
              />{" "}
              {/* 링크 미리보기 추출 상태 표시 */}
              {extractingThumbnail && (
                <div className="flex items-center text-sm text-amber-600 mt-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  링크 정보를 가져오는 중...
                </div>
              )}
            </div>
            {/* 썸네일 미리보기 및 수동 입력 */}
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">
                썸네일 이미지
              </label>

              {/* 썸네일 미리보기 */}
              {thumbnailUrl && (
                <div className="mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={thumbnailUrl}
                      alt="썸네일 미리보기"
                      className="w-16 h-16 object-cover rounded border border-amber-200"
                      onError={(e) => {
                        console.error("썸네일 이미지 로드 실패");
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setThumbnailUrl("")}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      제거
                    </button>
                  </div>
                </div>
              )}

              {/* 썸네일 URL 수동 입력 */}
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="썸네일 이미지 URL (자동 추출되지 않은 경우 직접 입력)"
                className="w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={addingLink}
              />
            </div>{" "}
            <div className="flex space-x-2">
              <button
                onClick={addLink}
                disabled={
                  !newLinkData.title.trim() ||
                  !newLinkData.url.trim() ||
                  addingLink
                }
                className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingLink && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{addingLink ? "추가 중..." : "추가"}</span>
              </button>{" "}
              <button
                onClick={() => {
                  setShowAddLinkForm(false);
                  setNewLinkData({ title: "", url: "" });
                  setThumbnailUrl("");
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                disabled={addingLink}
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
      )}{" "}
      {/* 링크 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.links.length > 0 ? (
          category.links.map((link) => (
            <div
              key={link.id}
              className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow relative"
            >
              {/* 삭제 버튼 */}
              <button
                onClick={() => removeLink(link.id)}
                disabled={deletingLinkId === link.id}
                className="absolute top-2 right-2 z-10 p-2 bg-white bg-opacity-80 rounded-full text-red-500 hover:text-red-700 hover:bg-opacity-100 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                aria-label={`${link.title} 링크 삭제`}
              >
                {deletingLinkId === link.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>

              {/* 썸네일 */}
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                {link.thumbnailImageUrl ? (
                  <img
                    src={link.thumbnailImageUrl}
                    alt={`${link.title} 썸네일`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 썸네일 로드 실패 시 기본 아이콘으로 대체
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex items-center justify-center w-full h-full">
                            <svg class="w-12 h-12 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7h-4c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <LinkIcon size={48} className="text-amber-300" />
                )}
              </div>

              {/* 카드 내용 */}
              <div className="p-4">
                {/* 제목 */}
                <h3 className="font-semibold text-amber-900 text-lg mb-2 line-clamp-2">
                  {link.title}
                </h3>

                {/* URL */}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-amber-600 hover:text-amber-800 hover:underline block truncate"
                  title={link.url}
                >
                  {link.url}
                </a>
              </div>

              {/* 클릭 영역 (전체 카드) */}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-0"
                aria-label={`${link.title} 링크로 이동`}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <LinkIcon size={48} className="text-amber-300 mx-auto mb-4" />
            <p className="text-amber-600">첫 번째 링크를 추가해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
