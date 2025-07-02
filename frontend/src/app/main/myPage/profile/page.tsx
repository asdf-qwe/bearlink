"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Calendar,
  Settings,
  LogOut,
  FileText,
  Edit,
  Save,
  X,
  Upload,
  Camera,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { myPageService } from "@/features/mypage/service/myPageService";

export default function MyPage() {
  const { userInfo, logout, updateUserInfo } = useAuth();
  const router = useRouter();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(userInfo?.bio || "");
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameText, setNicknameText] = useState(userInfo?.nickname || "");
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      await logout();
      router.push("/auth/login");
    }
  };

  const handleBioEdit = () => {
    // 다른 편집 모드 종료
    setIsEditingNickname(false);
    setIsEditingImage(false);

    setIsEditingBio(true);
    setBioText(userInfo?.bio || "");
    setError(null);
  };

  const handleBioSave = async () => {
    if (!bioText.trim()) {
      setError("소개를 입력해주세요.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // 백엔드 API 호출로 bio 업데이트
      await myPageService.updateBio(bioText.trim());

      // 성공 시 로컬 상태 업데이트
      updateUserInfo({ bio: bioText.trim() });
      setIsEditingBio(false);

      console.log("Bio 저장 완료:", bioText.trim());
    } catch (error) {
      console.error("Bio 저장 실패:", error);
      setError("프로필 업데이트에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBioCancel = () => {
    setIsEditingBio(false);
    setBioText(userInfo?.bio || "");
    setError(null);
  };

  // 닉네임 편집 관련 함수들
  const handleNicknameEdit = () => {
    // 다른 편집 모드 종료
    setIsEditingBio(false);
    setIsEditingImage(false);

    setIsEditingNickname(true);
    setNicknameText(userInfo?.nickname || "");
    setError(null);
  };

  const handleNicknameSave = async () => {
    if (!nicknameText.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await myPageService.updateNickname(nicknameText.trim());
      updateUserInfo({ nickname: nicknameText.trim() });
      setIsEditingNickname(false);

      console.log("닉네임 저장 완료:", nicknameText.trim());
    } catch (error) {
      console.error("닉네임 저장 실패:", error);
      setError("닉네임 업데이트에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNicknameCancel = () => {
    setIsEditingNickname(false);
    setNicknameText(userInfo?.nickname || "");
    setError(null);
  };

  // 이미지 편집 관련 함수들
  const handleImageEdit = () => {
    // 다른 편집 모드 종료
    setIsEditingBio(false);
    setIsEditingNickname(false);

    setIsEditingImage(true);
    setSelectedFile(null);
    setError(null);
  };

  const handleImageCancel = () => {
    setIsEditingImage(false);
    setSelectedFile(null);
    setError(null);
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 타입 검증
      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 업로드 가능합니다.");
        return;
      }

      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        setError("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  // 파일 업로드 및 프로필 이미지 업데이트
  const handleImageUpload = async () => {
    if (!selectedFile) {
      setError("업로드할 파일을 선택해주세요.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // 파일 업로드 (API에서 직접 imageUrl 반환)
      const uploadedImageUrl = await myPageService.uploadProfileImage(
        selectedFile
      );

      // 성공 시 로컬 상태 업데이트
      updateUserInfo({ imageUrl: uploadedImageUrl });
      setIsEditingImage(false);
      setSelectedFile(null);

      console.log("프로필 이미지 업로드 완료:", uploadedImageUrl);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      setError("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
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
      <h1 className="text-3xl font-bold text-amber-900 mb-8">프로필</h1>

      {/* 사용자 정보 카드 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          {/* 프로필 이미지 */}
          <div className="relative">
            {isEditingImage ? (
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-amber-600" />
              </div>
            ) : userInfo.imageUrl ? (
              <img
                src={userInfo.imageUrl}
                alt="프로필 이미지"
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  // 이미지 로드 실패 시 기본 아이콘으로 대체
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-amber-600" />
              </div>
            )}
            {!isEditingImage && (
              <button
                onClick={handleImageEdit}
                className="absolute -bottom-1 -right-1 p-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors shadow-lg"
                aria-label="프로필 이미지 변경"
              >
                <Camera size={14} />
              </button>
            )}
          </div>

          {/* 닉네임 */}
          <div className="flex-1">
            {isEditingNickname ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={nicknameText}
                  onChange={(e) => setNicknameText(e.target.value)}
                  className="text-2xl font-semibold text-amber-900 bg-amber-50 border border-amber-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isSaving}
                  maxLength={20}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleNicknameSave}
                    disabled={isSaving || !nicknameText.trim()}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={14} />
                    <span>{isSaving ? "저장 중..." : "저장"}</span>
                  </button>
                  <button
                    onClick={handleNicknameCancel}
                    disabled={isSaving}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    <X size={14} />
                    <span>취소</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-semibold text-amber-900">
                  {userInfo.nickname}
                </h2>
                <button
                  onClick={handleNicknameEdit}
                  className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded"
                  aria-label="닉네임 편집"
                >
                  <Edit size={16} />
                </button>
              </div>
            )}
            <p className="text-amber-600">환영합니다!</p>
          </div>
        </div>

        {/* 프로필 이미지 업로드 폼 */}
        {isEditingImage && (
          <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Camera size={20} className="mr-2 text-amber-600" />
              프로필 이미지 변경
            </h4>

            <div className="space-y-4">
              {/* 파일 선택 영역 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 파일 선택
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-colors">
                    <div className="text-center">
                      <Upload
                        size={32}
                        className="mx-auto text-gray-400 mb-2"
                      />
                      <p className="text-sm text-gray-600">
                        클릭하여 이미지 선택
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, GIF (최대 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* 선택된 파일 정보 */}
                {selectedFile && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText size={16} className="text-green-600" />
                        <span className="text-sm text-green-800 font-medium">
                          {selectedFile.name}
                        </span>
                        <span className="text-xs text-green-600">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 선택된 파일 미리보기 */}
              {selectedFile && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    선택된 파일:
                  </p>
                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="미리보기"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex space-x-3 pt-4">
                {selectedFile && (
                  <button
                    onClick={handleImageUpload}
                    disabled={isUploading}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>업로드 중...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        <span>파일 업로드</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={handleImageCancel}
                  disabled={isUploading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                >
                  <X size={16} />
                  <span>취소</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bio 섹션 */}
        <div className="mb-6 p-4 bg-amber-50 rounded-lg">
          {error && (
            <div className="mb-3 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-start space-x-3">
            <FileText size={20} className="text-amber-600 mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-amber-600">소개</p>
                {!isEditingBio && (
                  <button
                    onClick={handleBioEdit}
                    className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded"
                    aria-label="소개 편집"
                  >
                    <Edit size={16} />
                  </button>
                )}
              </div>

              {isEditingBio ? (
                <div className="space-y-3">
                  <textarea
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    placeholder="자신을 소개해보세요..."
                    className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    rows={3}
                    maxLength={200}
                    disabled={isSaving}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-600">
                      {bioText.length}/200자
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleBioSave}
                        disabled={isSaving || !bioText.trim()}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={14} />
                        <span>{isSaving ? "저장 중..." : "저장"}</span>
                      </button>
                      <button
                        onClick={handleBioCancel}
                        disabled={isSaving}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
                      >
                        <X size={14} />
                        <span>취소</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-amber-900 leading-relaxed">{userInfo.bio}</p>
              )}
            </div>
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
