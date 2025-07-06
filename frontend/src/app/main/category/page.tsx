"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { categoryService } from "@/features/category/service/categoryService";
import { Category } from "@/features/category/types/categoryTypes";

// 더미 동영상 URL (실제로는 서버의 동영상 URL을 사용)
const videoUrl = "/demo-video.mp4"; // 로컬 경로 또는 서버 URL

// 카테고리 아이콘 순서 배열 (Sidebar.tsx와 동일하게 유지)
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

export default function CategoryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useAuth();
  const router = useRouter();

  // 첫 번째 카테고리로 자동 리디렉션 하기 위한 효과
  useEffect(() => {
    if (!isLoading && categories.length > 0) {
      router.push(`/main/category/${categories[0].id}`);
    }
  }, [categories, isLoading, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userInfo?.id) return;

      try {
        setIsLoading(true);
        setError(null);
        const categoriesData = await categoryService.getCategoriesByUserId(
          userInfo.id
        );
        setCategories(categoriesData);
      } catch (err) {
        console.error("카테고리 로딩 실패:", err);
        setError("카테고리를 불러오는데 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [userInfo?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        베어링크에 오신 것을 환영합니다
      </h1>
      <p className="text-gray-600 mb-8">
        베어링크는 여러분의 중요한 링크와 자료를 효율적으로 관리하고 공유할 수
        있는 서비스입니다. 개인 카테고리와 링크룸을 통해 다양한 정보를
        관리해보세요!
      </p>

      {/* 소개 영역 - 카테고리가 있는 경우 숨김 처리 */}
      {!isLoading && categories.length === 0 && (
        <div className="mb-12 bg-amber-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">베어링크 시작하기</h2>
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center">
            <img
              src="/main.png"
              alt="베어링크 메인 이미지"
              className="max-w-full max-h-full object-cover"
            />
          </div>
          <p className="mt-4 text-sm text-amber-700">
            ※ 사이드바를 이용하여 카테고리를 생성하고 링크를 관리해보세요.
          </p>
        </div>
      )}

      {/* 카테고리 탐색 섹션 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">카테고리 탐색</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
            <p className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          </div>
        )}

        {!isLoading && categories.length === 0 && !error ? (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-amber-700 mb-2">
              아직 카테고리가 없습니다
            </h3>
            <p className="text-amber-600 mb-4">
              사이드바의 + 버튼을 클릭해서 첫 번째 카테고리를 만들어보세요!
            </p>
            <div className="flex justify-center">
              <Link href="/main/myPage">
                <button className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors">
                  마이페이지로 이동
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link href={`/main/category/${category.id}`} key={category.id}>
                <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                  <div className="flex items-center mb-3">
                    <img
                      src={getCategoryIcon(index)}
                      alt={`카테고리 아이콘`}
                      className="w-8 h-8 object-contain mr-3"
                    />
                    <h3 className="font-bold text-xl">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 시작하기 섹션 */}
      {!isLoading && categories.length === 0 && (
        <div className="bg-amber-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">지금 바로 시작하세요!</h2>
          <p className="mb-4">
            첫 번째 카테고리를 만들고, 유용한 링크 컬렉션을 구성해보세요.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                const sidebarAddButton = document.querySelector(
                  '[aria-label="카테고리 추가 폼 열기"]'
                );
                if (sidebarAddButton) {
                  (sidebarAddButton as HTMLButtonElement).click();
                }
              }}
              className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
            >
              새 카테고리 만들기
            </button>
            <Link href="/main/myPage">
              <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                내 프로필로 가기
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
