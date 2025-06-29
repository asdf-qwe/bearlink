import { useCallback } from "react";
import { LinkItem } from "@/features/category/types/categoryPageTypes";

interface UseLocalStorageProps {
  categoryId: number;
}

export const useLocalStorage = ({ categoryId }: UseLocalStorageProps) => {
  const saveLinksToStorage = useCallback(
    (links: LinkItem[]) => {
      localStorage.setItem(
        `category_${categoryId}_links`,
        JSON.stringify(links)
      );
    },
    [categoryId]
  );

  const getLinksFromStorage = useCallback((): LinkItem[] => {
    try {
      const stored = localStorage.getItem(`category_${categoryId}_links`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("로컬 스토리지에서 링크 로드 실패:", error);
      return [];
    }
  }, [categoryId]);

  return {
    saveLinksToStorage,
    getLinksFromStorage,
  };
};
