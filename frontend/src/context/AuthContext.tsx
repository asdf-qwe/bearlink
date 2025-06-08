"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/service/authService";
import { UserResponseDto } from "@/features/auth/types/auth";

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: UserResponseDto | null;
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isAuthenticated = await authService.isLoggedIn();
        if (isAuthenticated) {
          // 토큰이 있으면 사용자 정보 요청
          const userInfoData = await authService.getCurrentUser();
          setUserInfo(userInfoData);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("인증 상태 확인 실패:", err);
        // 오류 발생 시 로그아웃 처리
        await authService.logout();
        setIsLoggedIn(false);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // 로그인 함수
  const login = async (loginId: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login({ loginId, password });
      const userInfoData = await authService.getCurrentUser();
      setUserInfo(userInfoData);
      setIsLoggedIn(true);

      // 로그인 성공 후 메인 페이지로 이동
      router.push("/main");
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // 로그아웃 함수
  const logout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setUserInfo(null);
    router.push("/auth/login");
  };

  const value = {
    isLoggedIn,
    userInfo,
    login,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
