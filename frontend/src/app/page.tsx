"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { categoryService } from "@/features/category/service/categoryService";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BackgroundCard from "@/components/BackgroundCard";

export default function HomePage() {
  const { isLoggedIn, userInfo } = useAuth();
  const router = useRouter();

  const handleStartClick = async () => {
    if (!isLoggedIn || !userInfo) {
      // 로그인되지 않은 경우 로그인 페이지로 이동
      router.push("/auth/login");
      return;
    }

    try {
      const categories = await categoryService.getCategoriesByUserId(
        userInfo.id
      );
      if (categories && categories.length > 0) {
        // 첫 번째 카테고리로 이동
        router.push(`/main/category/${categories[0].id}`);
      } else {
        // 카테고리가 없으면 마이페이지로 이동
        router.push("/main/myPage");
      }
    } catch (error) {
      console.error("카테고리 로딩 실패:", error);
      // 에러 발생 시 마이페이지로 이동
      router.push("/main/myPage");
    }
  };
  return (
    <>
      <Header />
      <div className="min-h-screen bg-amber-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-amber-900 mb-8">
            산속 오두막에 링크를 모아보세요
          </h1>
          {/* 메인 배경 카드 */}
          <div className="mb-8">
            <BackgroundCard imageUrl="/home.png" className="h-[32rem]" />
          </div>
          {/* 추가 섹션 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-200">
              <h2 className="text-2xl font-semibold mb-4 text-amber-900">
                🔗 링크 관리
              </h2>
              <p className="text-amber-700 mb-4">
                중요한 웹사이트를 카테고리별로 정리하고 쉽게 찾아보세요.
              </p>
              <button
                onClick={handleStartClick}
                className="inline-block px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                시작하기 →
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-200">
              <h2 className="text-2xl font-semibold mb-4 text-amber-900">
                🐻 링크룸
              </h2>
              <p className="text-amber-700 mb-4">
                곰돌이와 함께하는 특별한 링크 관리 공간을 경험해보세요.
              </p>
              <Link
                href="/auth/login"
                className="inline-block px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                로그인 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
