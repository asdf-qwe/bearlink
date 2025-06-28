"use client";

import { useAuth } from "@/context/AuthContext";
import { Settings, User, Bell, Lock, Palette, Globe } from "lucide-react";

export default function SettingsPage() {
  const { userInfo } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">설정</h1>

      {/* 계정 설정 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <User size={24} className="text-amber-600" />
          <h2 className="text-xl font-semibold text-amber-900">계정 설정</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <div>
              <p className="font-medium text-amber-900">이메일 변경</p>
              <p className="text-sm text-amber-600">현재: {userInfo?.email}</p>
            </div>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              변경
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <div>
              <p className="font-medium text-amber-900">비밀번호 변경</p>
              <p className="text-sm text-amber-600">
                보안을 위해 정기적으로 변경하세요
              </p>
            </div>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              변경
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <div>
              <p className="font-medium text-amber-900">닉네임 변경</p>
              <p className="text-sm text-amber-600">
                현재: {userInfo?.nickname}
              </p>
            </div>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              변경
            </button>
          </div>
        </div>
      </div>

      {/* 알림 설정 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Bell size={24} className="text-amber-600" />
          <h2 className="text-xl font-semibold text-amber-900">알림 설정</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <div>
              <p className="font-medium text-amber-900">이메일 알림</p>
              <p className="text-sm text-amber-600">
                새로운 기능 및 업데이트 알림
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <div>
              <p className="font-medium text-amber-900">브라우저 알림</p>
              <p className="text-sm text-amber-600">웹 브라우저 푸시 알림</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 보안 설정 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Lock size={24} className="text-amber-600" />
          <h2 className="text-xl font-semibold text-amber-900">보안 설정</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <div>
              <p className="font-medium text-amber-900">2단계 인증</p>
              <p className="text-sm text-amber-600">계정 보안을 강화하세요</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              활성화
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <div>
              <p className="font-medium text-amber-900">로그인 기록</p>
              <p className="text-sm text-amber-600">최근 로그인 활동 확인</p>
            </div>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              보기
            </button>
          </div>
        </div>
      </div>

      {/* 테마 설정 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Palette size={24} className="text-amber-600" />
          <h2 className="text-xl font-semibold text-amber-900">테마 설정</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <div>
              <p className="font-medium text-amber-900">다크 모드</p>
              <p className="text-sm text-amber-600">어두운 테마 사용</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <div>
              <p className="font-medium text-amber-900">테마 색상</p>
              <p className="text-sm text-amber-600">앱의 메인 색상 변경</p>
            </div>
            <select className="px-3 py-1 border border-amber-300 rounded-lg bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="amber">Amber (기본)</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
            </select>
          </div>
        </div>
      </div>

      {/* 언어 설정 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Globe size={24} className="text-amber-600" />
          <h2 className="text-xl font-semibold text-amber-900">언어 및 지역</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <div>
              <p className="font-medium text-amber-900">언어</p>
              <p className="text-sm text-amber-600">앱 인터페이스 언어</p>
            </div>
            <select className="px-3 py-1 border border-amber-300 rounded-lg bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <div>
              <p className="font-medium text-amber-900">시간대</p>
              <p className="text-sm text-amber-600">현재: Asia/Seoul (GMT+9)</p>
            </div>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              변경
            </button>
          </div>
        </div>
      </div>

      {/* 위험 영역 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <h2 className="text-xl font-semibold text-red-600 mb-4">위험 영역</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-red-900">데이터 내보내기</p>
              <p className="text-sm text-red-600">
                모든 데이터를 JSON 파일로 내보내기
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              내보내기
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-red-900">계정 삭제</p>
              <p className="text-sm text-red-600">
                모든 데이터가 영구적으로 삭제됩니다
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
