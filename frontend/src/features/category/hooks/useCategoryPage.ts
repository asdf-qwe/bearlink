import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { categoryService } from "@/features/category/service/categoryService";
import { linkService } from "@/features/link/service/linkService";
import { LinkRequestDto } from "@/features/link/types/link";
import {
  CategoryWithLinks,
  LinkItem,
  NewLinkData,
} from "@/features/category/types/categoryPageTypes";
import { useLocalStorage } from "./useLocalStorage";

interface UseCategoryPageProps {
  categoryId: number;
  userId?: number;
}

export const useCategoryPage = ({
  categoryId,
  userId,
}: UseCategoryPageProps) => {
  const router = useRouter();
  const [category, setCategory] = useState<CategoryWithLinks | null>(null);
  const [newLinkData, setNewLinkData] = useState<NewLinkData>({
    title: "",
    url: "",
  });
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingLink, setAddingLink] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryIndex, setCategoryIndex] = useState<number>(0);
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [editingLinkTitle, setEditingLinkTitle] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);

  const { saveLinksToStorage } = useLocalStorage({ categoryId });

  // 카테고리 로드
  const loadCategory = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const categories = await categoryService.getCategoriesByUserId(userId);
      const currentCategory = categories.find((cat) => cat.id === categoryId);

      if (currentCategory) {
        const categoryIdx = categories.findIndex(
          (cat) => cat.id === categoryId
        );
        setCategoryIndex(categoryIdx >= 0 ? categoryIdx : 0);

        const backendLinks = await linkService.getLinks(userId, categoryId);
        const convertedLinks: LinkItem[] = backendLinks.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          thumbnailImageUrl: link.thumbnailImageUrl,
        }));

        const categoryWithLinks: CategoryWithLinks = {
          id: currentCategory.id,
          name: currentCategory.name,
          links: convertedLinks,
        };

        setCategory(categoryWithLinks);
        setCategoryName(currentCategory.name);

        try {
          const youtubeIds = await linkService.getYoutubeVideoIds(categoryId);
          setVideoIds(youtubeIds);
        } catch (err) {}

        saveLinksToStorage(convertedLinks);
      } else {
        setError("카테고리를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error("카테고리 로딩 실패:", err);
      setError("카테고리를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [categoryId, userId, saveLinksToStorage]);

  // 링크 추가
  const addLink = useCallback(async () => {
    if (!category || !userId || newLinkData.url.trim() === "") return;

    let url = newLinkData.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    setAddingLink(true);
    setError(null);

    try {
      const linkRequestDto: LinkRequestDto = {
        url: url,
        ...(newLinkData.title.trim() && { title: newLinkData.title.trim() }),
      };

      const createMessage = await linkService.createLink(
        userId,
        category.id,
        linkRequestDto
      );
      console.log("링크 생성 성공:", createMessage); // 성공 메시지 로깅

      const updatedLinks = await linkService.getLinks(userId, category.id);
      const convertedLinks: LinkItem[] = updatedLinks.map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        thumbnailImageUrl: link.thumbnailImageUrl,
      }));

      const updatedCategory = { ...category, links: convertedLinks };
      setCategory(updatedCategory);
      setNewLinkData({ title: "", url: "" });
      setShowAddLinkForm(false);
      saveLinksToStorage(convertedLinks);

      // 유튜브 링크 목록도 즉시 갱신
      try {
        const youtubeIds = await linkService.getYoutubeVideoIds(category.id);
        setVideoIds(youtubeIds);
      } catch (err) {}
    } catch (error) {
      console.error("링크 생성 실패:", error);
      setError("링크 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setAddingLink(false);
    }
  }, [category, userId, newLinkData, saveLinksToStorage]);

  // 링크 삭제
  const removeLink = useCallback(
    async (linkId: number) => {
      if (!category || !userId) return;

      const linkToDelete = category.links.find((link) => link.id === linkId);
      const confirmMessage = linkToDelete
        ? `"${linkToDelete.title}" 링크를 삭제하시겠습니까?`
        : "이 링크를 삭제하시겠습니까?";

      if (!window.confirm(confirmMessage)) return;

      setDeletingLinkId(linkId);
      setError(null);

      try {
        const deleteMessage = await linkService.deleteLink(linkId);
        console.log("링크 삭제 성공:", deleteMessage); // 성공 메시지 로깅

        const updatedCategory = {
          ...category,
          links: category.links.filter((link) => link.id !== linkId),
        };
        setCategory(updatedCategory);
        saveLinksToStorage(updatedCategory.links);
      } catch (error) {
        console.error("링크 삭제 실패:", error);
        setError("링크 삭제에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setDeletingLinkId(null);
      }
    },
    [category, userId, saveLinksToStorage]
  );

  // 링크 제목 수정
  const updateLinkTitle = useCallback(
    async (linkId: number, newTitle: string) => {
      if (!category || !userId || !newTitle || newTitle.trim() === "") return;

      try {
        setError(null);
        const updateMessage = await linkService.updateTitle(linkId, {
          title: newTitle.trim(),
        });
        console.log("링크 제목 수정 성공:", updateMessage); // 성공 메시지 로깅

        const updatedLinks = await linkService.getLinks(userId, category.id);
        const convertedLinks: LinkItem[] = updatedLinks.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          thumbnailImageUrl: link.thumbnailImageUrl,
        }));

        const updatedCategory = { ...category, links: convertedLinks };
        setCategory(updatedCategory);
        setEditingLinkId(null);
        setEditingLinkTitle("");
        saveLinksToStorage(convertedLinks);
      } catch (error) {
        console.error("링크 제목 수정 실패:", error);
        setError("링크 제목 수정에 실패했습니다. 다시 시도해주세요.");
      }
    },
    [category, userId, saveLinksToStorage]
  );

  // 카테고리 이름 저장
  const saveCategoryName = useCallback(async () => {
    if (!category || categoryName.trim() === "" || !userId) return;

    try {
      setError(null);
      await categoryService.updateCategory(
        { name: categoryName.trim() },
        category.id
      );

      const updatedCategory = { ...category, name: categoryName.trim() };
      setCategory(updatedCategory);
      setEditingCategory(false);
      window.dispatchEvent(new CustomEvent("categoryUpdated"));
    } catch (error) {
      console.error("카테고리 이름 업데이트 실패:", error);
      setError("카테고리 이름 수정에 실패했습니다. 다시 시도해주세요.");
      setCategoryName(category.name);
    }
  }, [category, categoryName, userId]);

  // 초기 로드
  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  // 카테고리 삭제 이벤트 처리
  useEffect(() => {
    const handleCategoryDeleted = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const deletedCategoryId = customEvent.detail?.categoryId;

      if (deletedCategoryId === categoryId && userId) {
        try {
          const remainingCategories =
            await categoryService.getCategoriesByUserId(userId);
          if (remainingCategories.length > 0) {
            router.push(`/main/category/${remainingCategories[0].id}`);
          } else {
            router.push("/main/category");
          }
        } catch (error) {
          console.error("카테고리 목록 조회 실패:", error);
          router.push("/main/category");
        }
      }
    };

    window.addEventListener("categoryDeleted", handleCategoryDeleted);
    return () =>
      window.removeEventListener("categoryDeleted", handleCategoryDeleted);
  }, [categoryId, userId, router]);

  return {
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
    loadCategory,
  };
};
