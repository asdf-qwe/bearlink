"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { categoryService } from "@/features/category/service/categoryService";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { userInfo } = useAuth();

  useEffect(() => {
    // 페이지 로드 시 첫 번째 카테고리로 리다이렉트
    const redirectToFirstCategory = async () => {
      if (!userInfo?.id) return;

      try {
        const categories = await categoryService.getCategoriesByUserId(
          userInfo.id
        );

        if (categories && categories.length > 0) {
          // 첫 번째 카테고리로 이동
          router.replace(`/main/category/${categories[0].id}`);
        }
        // 카테고리가 없으면 현재 페이지에 머물기
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
        // 오류 발생 시 현재 페이지에 머물기
      }
    };

    redirectToFirstCategory();
  }, [router, userInfo?.id]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-amber-50">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-amber-900">
          BearLink에 오신 것을 환영합니다
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-amber-200">
          <h2 className="text-2xl font-semibold mb-4 text-amber-900">
            시작하기
          </h2>
          <p className="mb-4 text-amber-800">
            왼쪽의 사이드바를 통해 다양한 메뉴로 이동할 수 있습니다. 사이드바의
            메뉴는 직접 추가하고 삭제할 수 있습니다.
          </p>
          <p className="mb-4 text-amber-800">
            사이드바 메뉴 목록 아래에 있는 입력창에 새로운 메뉴 이름을 입력하고
            + 버튼을 클릭하면 메뉴가 추가됩니다.
          </p>
          <p className="text-amber-800">
            각 메뉴 항목 옆의 X 버튼을 클릭하면 해당 메뉴가 삭제됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-amber-200">
            <h2 className="text-xl font-semibold mb-3 text-amber-900">
              링크룸
            </h2>
            <p className="text-amber-700">
              다른 사용자들과 링크를 공유하고 소통할 수 있는 공간입니다.
            </p>
            <div className="mt-4">
              <a
                href="/linkRoom"
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 inline-block"
              >
                방문하기
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-amber-200">
            <h2 className="text-xl font-semibold mb-3 text-amber-900">
              마이페이지
            </h2>
            <p className="text-amber-700">
              사용자 정보와 저장한 링크를 관리할 수 있는 개인 페이지입니다.
            </p>
            <div className="mt-4">
              <a
                href="/myPage"
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 inline-block"
              >
                방문하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
