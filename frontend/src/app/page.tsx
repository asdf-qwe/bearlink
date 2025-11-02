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
      <div className="min-h-screen bg-amber-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center text-amber-900 mb-8 sm:mb-10 lg:mb-12 px-4">
            산속 오두막에 링크를 모아보세요
          </h1>

          {/* 메인 컨텐츠 - 이미지와 서비스 안내 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mb-12 sm:mb-14 lg:mb-16">
            {/* 왼쪽: 삽화 이미지 */}
            <div className="order-2 lg:order-1">
              <BackgroundCard
                imageUrl="/home.png"
                className="h-48 sm:h-64 lg:h-80 xl:h-96 w-full"
              />
            </div>

            {/* 오른쪽: 서비스 안내 */}
            <div className="order-1 lg:order-2 space-y-4 sm:space-y-6 px-4 sm:px-0">
              <div className="text-center lg:text-left">
                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-900 mb-3 sm:mb-4 leading-tight">
                  BearLink와 함께하는 스마트 링크 관리
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-amber-700 mb-4 sm:mb-6 leading-relaxed">
                  흩어진 링크들을 깔끔하게 정리하고, 친구들과 공유해보세요.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-white border-2 border-amber-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-amber-900">
                      카테고리별 정리
                    </h3>
                    <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
                      웹사이트를 주제별로 깔끔하게 분류하여 관리하세요
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-white border-2 border-amber-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-amber-900">
                      링크룸 공유
                    </h3>
                    <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
                      친구들과 함께 링크를 공유하고 실시간으로 소통하세요
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-white border-2 border-amber-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-amber-900">
                      빠른 접근
                    </h3>
                    <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
                      즐겨찾기한 사이트에 클릭 한 번으로 바로 접속하세요
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 lg:pt-6">
                <button
                  onClick={handleStartClick}
                  className="w-full lg:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-amber-600 text-amber-600 text-base sm:text-lg font-semibold rounded-lg hover:bg-amber-50 hover:border-amber-700 hover:text-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  지금 시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
