"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { LogOut, LogIn, User } from "lucide-react";
import { categoryService } from "@/features/category/service/categoryService";

export default function Header() {
  const pathname = usePathname();
  const { isLoggedIn, userInfo, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isActive = (path: string) => {
    return pathname === path
      ? "text-white border-b-[3px] border-amber-200"
      : "text-amber-100 hover:text-white";
  };
  // 링크룸 클릭 핸들러 - 첫 번째 카테고리 또는 메인 카테고리 페이지로 이동
  const handleLinkRoomClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isLoggedIn || !userInfo) {
      router.push("/auth/login");
      return;
    }

    try {
      // 사용자의 카테고리 목록을 가져옴
      const categories = await categoryService.getCategoriesByUserId(
        userInfo.id
      );

      if (categories && categories.length > 0) {
        // 카테고리가 있으면 첫 번째 카테고리로 이동
        router.push(`/main/category/${categories[0].id}`);
      } else {
        // 카테고리가 없으면 카테고리 메인 페이지로 이동
        router.push("/main/category");
      }
    } catch (error) {
      console.error("카테고리 조회 실패:", error);
      // 에러 발생 시 카테고리 메인 페이지로 이동
      router.push("/main/category");
    }
  };

  // 사용자 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header
      className="shadow-md border-b border-stone-300"
      style={{
        backgroundImage: "url('/namu.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#8B5A3C", // BackgroundCard와 동일한 폴백 색상
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {" "}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
              >
                BearLink
              </Link>
            </div>
            <nav className="ml-10 flex items-center space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive(
                  "/"
                )}`}
              >
                홈
              </Link>
              <button
                onClick={handleLinkRoomClick}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname.startsWith("/main/category") ||
                  pathname.startsWith("/main/room")
                    ? "text-white border-b-[3px] border-amber-200"
                    : "text-amber-100 hover:text-white"
                }`}
              >
                링크룸
              </button>
              <Link
                href="/main/myPage"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname.startsWith("/main/myPage")
                    ? "text-white border-b-[3px] border-amber-200"
                    : "text-amber-100 hover:text-white"
                }`}
              >
                마이페이지
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full text-amber-100 hover:text-white focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <div className="ml-3 relative">
              <div>
                {isLoggedIn ? (
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-1 rounded-full text-amber-100 hover:text-white focus:outline-none flex items-center"
                  >
                    <User className="h-6 w-6" />{" "}
                    <span className="ml-2 hidden sm:inline-block">
                      {userInfo?.nickname}
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="p-1 rounded-full text-amber-100 hover:text-white focus:outline-none flex items-center"
                  >
                    <LogIn className="h-6 w-6" />
                    <span className="ml-2 hidden sm:inline-block">로그인</span>
                  </Link>
                )}
              </div>

              {showUserMenu && isLoggedIn && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
                >
                  <Link
                    href="/main/myPage"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    프로필
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      로그아웃
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
