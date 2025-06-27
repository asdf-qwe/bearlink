"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Mail, Calendar, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const { userInfo, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      await logout();
      router.push("/auth/login");
    }
  };

  if (!userInfo) {
    return (
      <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
        <div className="text-center">
          <p className="text-amber-700">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">마이페이지</h1>

      {/* 사용자 정보 카드 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <User size={32} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-amber-900">
              {userInfo.nickname}
            </h2>
            <p className="text-amber-600">환영합니다!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
            <Mail size={20} className="text-amber-600" />
            <div>
              <p className="text-sm text-amber-600">이메일</p>
              <p className="font-medium text-amber-900">{userInfo.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
            <User size={20} className="text-amber-600" />
            <div>
              <p className="text-sm text-amber-600">로그인 ID</p>
              <p className="font-medium text-amber-900">{userInfo.loginId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 메뉴 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-amber-900 mb-4">설정</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-amber-50 rounded-lg transition-colors">
            <Settings size={20} className="text-amber-600" />
            <div>
              <p className="font-medium text-amber-900">계정 설정</p>
              <p className="text-sm text-amber-600">
                프로필 정보 및 비밀번호 변경
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
}
