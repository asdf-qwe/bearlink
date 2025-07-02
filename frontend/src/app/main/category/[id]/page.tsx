"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCategoryPage } from "@/features/category/hooks/useCategoryPage";
import {
  LoadingState,
  ErrorState,
  NotFoundState,
} from "@/features/category/components/PageStates";
import { CategoryHeader } from "@/features/category/components/CategoryHeader";
import { AddLinkForm } from "@/features/category/components/AddLinkForm";
import { LinkGrid } from "@/features/category/components/LinkGrid";
import YouTubePlayer from "@/components/YouTubePlayer";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { userInfo } = useAuth();
  const categoryId = Number(params.id as string);

  const {
    // State
    category,
    newLinkData,
    showAddLinkForm,
    editingCategory,
    categoryName,
    loading,
    addingLink,
    deletingLinkId,
    error,
    categoryIndex,
    editingLinkId,
    editingLinkTitle,
    videoIds,

    // Setters
    setNewLinkData,
    setShowAddLinkForm,
    setEditingCategory,
    setCategoryName,
    setError,
    setEditingLinkId,
    setEditingLinkTitle,

    // Actions
    addLink,
    removeLink,
    updateLinkTitle,
    saveCategoryName,
  } = useCategoryPage({ categoryId, userId: userInfo?.id });

  // 키보드 이벤트 핸들러들
  const handleUrlChange = (url: string) => {
    setNewLinkData((prev) => ({ ...prev, url }));
    setError(null);
  };

  const handleTitleChange = (title: string) => {
    setNewLinkData((prev) => ({ ...prev, title }));
    setError(null);
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
      setError(null);
    }
  };

  const handleLinkTitleKeyPress = (e: React.KeyboardEvent, linkId: number) => {
    if (e.key === "Enter") {
      updateLinkTitle(linkId, editingLinkTitle);
    } else if (e.key === "Escape") {
      setEditingLinkId(null);
      setEditingLinkTitle("");
    }
  };

  const startEditingLink = (linkId: number, currentTitle: string) => {
    setEditingLinkId(linkId);
    setEditingLinkTitle(currentTitle);
    setError(null);
  };

  const cancelEditingLink = () => {
    setEditingLinkId(null);
    setEditingLinkTitle("");
    setError(null);
  };

  const handleCategoryNameChange = (name: string) => {
    setCategoryName(name);
    setError(null);
  };

  const handleCategoryEditStart = () => {
    setEditingCategory(true);
  };

  const handleCategoryEditCancel = () => {
    setEditingCategory(false);
    setCategoryName(category?.name || "");
    setError(null);
  };

  const handleAddLinkFormCancel = () => {
    setShowAddLinkForm(false);
    setNewLinkData({ title: "", url: "" });
    setError(null);
  };

  // 로딩 상태
  if (loading) {
    return <LoadingState message="카테고리를 불러오는 중..." />;
  }

  // 에러 상태
  if (error && !category) {
    return <ErrorState error={error} onBack={() => router.back()} />;
  }

  // 카테고리 없음 상태
  if (!category) {
    return <NotFoundState onBack={() => router.back()} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
      {/* 카테고리 헤더 */}
      <CategoryHeader
        categoryName={categoryName}
        editingCategory={editingCategory}
        error={error && editingCategory ? error : null}
        onEditStart={handleCategoryEditStart}
        onCategoryNameChange={handleCategoryNameChange}
        onSave={saveCategoryName}
        onCancel={handleCategoryEditCancel}
        onKeyPress={handleCategoryKeyPress}
      />

      {/* YouTube 플레이어 */}
      {videoIds.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <YouTubePlayer videoIds={videoIds} />
        </div>
      )}

      {/* 링크 추가 폼 */}
      <AddLinkForm
        newLinkData={newLinkData}
        showAddLinkForm={showAddLinkForm}
        addingLink={addingLink}
        error={error && !editingCategory ? error : null}
        onUrlChange={handleUrlChange}
        onTitleChange={handleTitleChange}
        onSubmit={addLink}
        onCancel={handleAddLinkFormCancel}
        onShowForm={() => setShowAddLinkForm(true)}
        onKeyPress={handleLinkKeyPress}
      />

      {/* 링크 그리드 */}
      <LinkGrid
        links={category.links}
        categoryIndex={categoryIndex}
        editingLinkId={editingLinkId}
        editingLinkTitle={editingLinkTitle}
        deletingLinkId={deletingLinkId}
        onEditLink={startEditingLink}
        onDeleteLink={removeLink}
        onTitleChange={setEditingLinkTitle}
        onSaveTitle={(linkId, title) => updateLinkTitle(linkId, title)}
        onCancelEdit={cancelEditingLink}
        onKeyPress={handleLinkTitleKeyPress}
      />
    </div>
  );
}
