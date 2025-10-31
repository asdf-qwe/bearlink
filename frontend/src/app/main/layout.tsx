"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import MainContent from "@/components/MainContent";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  // 로딩 상태 메모이제이션
  const shouldRedirect = useMemo(
    () => !loading && !isLoggedIn,
    [loading, isLoggedIn]
  );
  const showLoadingScreen = useMemo(
    () => loading || !isLoggedIn,
    [loading, isLoggedIn]
  );

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/auth/login");
    }
  }, [shouldRedirect, router]);

  // 로딩 컴포넌트 메모이제이션
  const LoadingScreen = useMemo(
    () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-600">로딩 중...</p>
        </div>
      </div>
    ),
    []
  );

  // 로딩 중이거나 로그인하지 않은 경우 로딩 표시
  if (showLoadingScreen) {
    return LoadingScreen;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}
