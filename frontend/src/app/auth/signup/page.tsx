"use client";

import React, { useState, FormEvent } from "react";
import { authService } from "@/features/auth/service/authService";
import { SignupRequestDto } from "@/features/auth/types/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 기본 유효성 검사
    if (!email.trim() || !password.trim() || !nickname.trim()) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      const signupData: SignupRequestDto = {
        email,
        password,
        nickname,
      };

      await authService.signup(signupData);

      setSuccess("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");

      // 잠시 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      console.error("회원가입 에러:", err);
      setError(
        err.message || "회원가입에 실패했습니다. 입력한 정보를 확인해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-100">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-stone-900">
            BearLink에 회원가입
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-amber-600 hover:text-amber-500"
            >
              로그인
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full appearance-none rounded-md border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-stone-700"
              >
                닉네임
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="relative block w-full appearance-none rounded-md border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                placeholder="사용하실 닉네임을 입력하세요"
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full appearance-none rounded-md border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                placeholder="비밀번호 입력"
              />
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-stone-700"
              >
                비밀번호 확인
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="relative block w-full appearance-none rounded-md border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                placeholder="비밀번호 재입력"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
              {success}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white ${
                loading
                  ? "bg-amber-300 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              }`}
            >
              {loading ? "회원가입 중..." : "회원가입"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
