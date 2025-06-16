"use client";

import React, { useState, FormEvent } from "react";
import { authService } from "@/features/auth/service/authService";
import { SignupRequestDto } from "@/features/auth/types/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import {
  validatePassword,
  validatePasswordConfirm,
} from "@/utils/passwordValidation";

export default function SignupPage() {
  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailValidation, setEmailValidation] = useState<{
    isChecking: boolean;
    isValid: boolean | null;
    message: string;
  }>({
    isChecking: false,
    isValid: null,
    message: "",
  });
  const [loginIdValidation, setLoginIdValidation] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  }>({
    checked: false,
    available: false,
    message: "",
  });
  const [loginIdChecking, setLoginIdChecking] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({
    isValid: false,
    message: "",
  });
  const [passwordConfirmValidation, setPasswordConfirmValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({
    isValid: false,
    message: "",
  });
  const router = useRouter();

  // 로그인 ID 중복 체크 함수
  const handleLoginIdCheck = async () => {
    if (!loginId.trim()) {
      setError("로그인 ID를 입력해주세요.");
      return;
    }

    try {
      setLoginIdChecking(true);
      setError(null);

      const result = await authService.checkLoginId(loginId);
      setLoginIdValidation({
        checked: true,
        available: result.available,
        message: result.message,
      });
    } catch (err: any) {
      setLoginIdValidation({
        checked: true,
        available: false,
        message: err.message || "로그인 ID 확인에 실패했습니다.",
      });
    } finally {
      setLoginIdChecking(false);
    }
  };

  // 로그인 ID 입력값이 변경되면 중복 체크 결과 초기화
  const handleLoginIdChange = (value: string) => {
    setLoginId(value);
    setLoginIdValidation({ checked: false, available: false, message: "" });
  };

  // 이메일 중복 체크 함수
  const handleEmailBlur = async () => {
    if (!email.trim()) {
      setEmailValidation({ isChecking: false, isValid: null, message: "" });
      return;
    }

    // 이메일 형식 체크
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    if (!emailRegex.test(email)) {
      setEmailValidation({
        isChecking: false,
        isValid: false,
        message: "유효하지 않은 이메일 형식입니다",
      });
      return;
    }

    try {
      setEmailValidation({ isChecking: true, isValid: null, message: "" });

      const result = await authService.checkEmail(email);
      setEmailValidation({
        isChecking: false,
        isValid: result.available,
        message: result.message,
      });
    } catch (err: any) {
      setEmailValidation({
        isChecking: false,
        isValid: false,
        message: err.message || "이메일 확인에 실패했습니다.",
      });
    }
  };

  // 이메일 입력값이 변경되면 검증 상태 초기화
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailValidation.isValid !== null) {
      setEmailValidation({ isChecking: false, isValid: null, message: "" });
    }
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const validation = validatePassword(value);
    setPasswordValidation({
      isValid: validation.isValid,
      message: validation.message,
    });

    // 비밀번호 확인도 다시 검증
    if (passwordConfirm) {
      const confirmValidation = validatePasswordConfirm(value, passwordConfirm);
      setPasswordConfirmValidation(confirmValidation);
    }
  };

  // 비밀번호 확인 변경 핸들러
  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value);
    const validation = validatePasswordConfirm(password, value);
    setPasswordConfirmValidation(validation);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 기본 유효성 검사
    if (!loginId.trim() || !email.trim() || !password.trim()) {
      setError("로그인 ID, 이메일, 비밀번호는 필수 입력값입니다.");
      return;
    }

    // 비밀번호 복잡성 검사
    if (!passwordValidation.isValid) {
      setError("비밀번호 조건을 만족해주세요.");
      return;
    }

    // 비밀번호 확인 검사
    if (!passwordConfirmValidation.isValid) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 로그인 ID 중복 체크 완료 여부 확인
    if (!loginIdValidation.checked || !loginIdValidation.available) {
      setError("로그인 ID 중복 체크를 완료해주세요.");
      return;
    }

    // 이메일 중복 체크 완료 여부 확인
    if (emailValidation.isValid !== true) {
      setError("이메일 중복 체크를 완료해주세요.");
      return;
    }

    try {
      setLoading(true);
      const signupData: SignupRequestDto = {
        loginId,
        password,
        nickname: nickname.trim() || loginId, // 닉네임이 없으면 로그인 ID 사용
        email: email.trim(),
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
    <>
      <Header />{" "}
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-16">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg border border-stone-200">
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
            {" "}
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label
                  htmlFor="loginId"
                  className="block text-sm font-medium text-stone-700"
                >
                  로그인 ID <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    id="loginId"
                    name="loginId"
                    type="text"
                    autoComplete="username"
                    required
                    value={loginId}
                    onChange={(e) => handleLoginIdChange(e.target.value)}
                    className="flex-1 relative block w-full appearance-none rounded-md border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                    placeholder="로그인 ID (이메일도 가능)"
                  />
                  {loginId.trim() && (
                    <button
                      type="button"
                      onClick={handleLoginIdCheck}
                      disabled={loginIdChecking || loading}
                      className="px-4 py-2 bg-amber-600 text-white text-sm rounded-md hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {loginIdChecking ? "확인중..." : "중복체크"}
                    </button>
                  )}
                </div>
                {/* 로그인 ID 중복 체크 결과 표시 */}
                {loginIdValidation.checked && (
                  <div
                    className={`mt-1 text-sm ${
                      loginIdValidation.available
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {loginIdValidation.message}
                  </div>
                )}
              </div>{" "}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-stone-700"
                >
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={handleEmailBlur}
                  className="relative block w-full appearance-none rounded-md border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                  placeholder="example@email.com"
                />
                {emailValidation.isChecking && (
                  <p className="mt-2 text-sm text-stone-500">
                    이메일 중복 확인 중...
                  </p>
                )}
                {emailValidation.isValid === false && (
                  <p className="mt-2 text-sm text-red-600">
                    {emailValidation.message}
                  </p>
                )}
                {emailValidation.isValid === true && (
                  <p className="mt-2 text-sm text-green-600">
                    {emailValidation.message}
                  </p>
                )}
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
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="relative block w-full appearance-none rounded-md border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                  placeholder="닉네임 (선택사항)"
                />
              </div>
              {/* 역할 선택 필드 제거 */}{" "}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-stone-700"
                >
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-stone-900 placeholder-stone-400 focus:z-10 focus:outline-none sm:text-sm ${
                    password && passwordValidation.isValid
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                      : password && !passwordValidation.isValid
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-stone-300 focus:border-amber-500 focus:ring-amber-500"
                  }`}
                  placeholder="영문, 숫자, 특수문자 중 2종류 이상, 10자 이상"
                />
                {password && (
                  <p
                    className={`mt-1 text-xs ${
                      passwordValidation.isValid
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {passwordValidation.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="passwordConfirm"
                  className="block text-sm font-medium text-stone-700"
                >
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => handlePasswordConfirmChange(e.target.value)}
                  className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-stone-900 placeholder-stone-400 focus:z-10 focus:outline-none sm:text-sm ${
                    passwordConfirm && passwordConfirmValidation.isValid
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                      : passwordConfirm && !passwordConfirmValidation.isValid
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-stone-300 focus:border-amber-500 focus:ring-amber-500"
                  }`}
                  placeholder="비밀번호 재입력"
                />
                {passwordConfirm && (
                  <p
                    className={`mt-1 text-xs ${
                      passwordConfirmValidation.isValid
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {passwordConfirmValidation.message}
                  </p>
                )}{" "}
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
    </>
  );
}
