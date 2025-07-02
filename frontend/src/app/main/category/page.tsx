"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 더미 카테고리 데이터
const dummyCategories = [
  { id: 1, name: "프로그래밍", description: "코딩 및 개발 관련 링크 모음" },
  { id: 2, name: "디자인", description: "UI/UX 및 그래픽 디자인 리소스" },
  { id: 3, name: "생산성", description: "업무 효율을 높이는 도구 모음" },
  { id: 4, name: "학습", description: "온라인 강의 및 교육 자료" },
];

// 더미 동영상 URL (실제로는 서버의 동영상 URL을 사용)
const videoUrl = "/demo-video.mp4"; // 로컬 경로 또는 서버 URL

export default function CategoryPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제로는 API 호출 등의 작업이 여기서 이루어짐
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">BearLink 소개</h1>
      <p className="text-gray-600 mb-8">
        BearLink는 여러분의 중요한 링크와 자료를 효율적으로 관리하고 공유할 수
        있는 서비스입니다. 아래 영상을 통해 BearLink의 주요 기능을 살펴보세요!
      </p>

      {/* 소개 동영상 섹션 */}
      <div className="mb-12 bg-gray-100 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">서비스 소개 영상</h2>
        <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
          <video controls className="w-full h-full" poster="/main.png">
            <source src={videoUrl} type="video/mp4" />
            브라우저가 비디오 태그를 지원하지 않습니다.
          </video>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          ※ 동영상을 통해 BearLink의 주요 기능과 사용법을 확인하실 수 있습니다.
        </p>
      </div>

      {/* 카테고리 탐색 섹션 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">카테고리 탐색</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummyCategories.map((category) => (
            <Link href={`/main/category/${category.id}`} key={category.id}>
              <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                <h3 className="font-bold text-xl mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 시작하기 섹션 */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">지금 바로 시작하세요!</h2>
        <p className="mb-4">
          원하는 카테고리를 선택하여 유용한 링크를 탐색하거나, 나만의 링크
          컬렉션을 만들어보세요.
        </p>
        <div className="flex space-x-4">
          <Link href="/main/category/new">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              새 카테고리 만들기
            </button>
          </Link>
          <Link href="/main/myPage">
            <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
              내 프로필로 가기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
