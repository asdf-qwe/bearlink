"use client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import BackgroundCard from "@/components/BackgroundCard";

export default function Home() {
  const { userInfo } = useAuth();

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 상단 문구 영역 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-amber-900 mb-4">
            링크 관리 메인 페이지
          </h1>
        </div>
        {/* 배경 카드 */}
        <div className="mb-8">
          <BackgroundCard imageUrl="/main.png" className="h-[50rem]" />
        </div>
      </div>
    </div>
  );
}
