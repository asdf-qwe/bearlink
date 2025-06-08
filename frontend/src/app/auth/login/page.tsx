"use client";

import React, { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, loading: authLoading } = useAuth();
  const router = useRouter();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // 기본 유효성 검사
    if (!loginId.trim() || !password.trim()) {
      setError("로그인 ID와 비밀번호를 모두 입력해주세요.");
      return;
    }
    try {
      // AuthContext의 login 함수 사용 (로그인 성공 시 자동으로 카테고리 페이지로 이동)
      await login(loginId, password);
    } catch (err: any) {
      console.error("로그인 에러:", err);
      setError(
        err.message ||
          "로그인에 실패했습니다. 로그인 ID와 비밀번호를 확인해주세요."
      );
    }
  };
  return (
    <>
      <Header />{" "}
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-16">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg border border-stone-200">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-stone-900">
              BearLink에 로그인
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              아직 계정이 없으신가요?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-amber-600 hover:text-amber-500"
              >
                회원가입
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {" "}
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label
                  htmlFor="loginId"
                  className="block text-sm font-medium text-stone-700"
                >
                  로그인 ID
                </label>
                <input
                  id="loginId"
                  name="loginId"
                  type="text"
                  autoComplete="username"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="relative block w-full appearance-none rounded-md border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                  placeholder="로그인 ID 또는 이메일"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-stone-700"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full appearance-none rounded-md border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                  placeholder="비밀번호 입력"
                />
              </div>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-stone-900"
                >
                  로그인 상태 유지
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="#"
                  className="font-medium text-amber-600 hover:text-amber-500"
                >
                  비밀번호 찾기
                </Link>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={authLoading}
                className={`group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white ${
                  authLoading
                    ? "bg-amber-300 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                }`}
              >
                {authLoading ? "로그인 중..." : "로그인"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
