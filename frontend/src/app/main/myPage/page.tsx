"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import BackgroundCard from "@/components/BackgroundCard";
import { useRouter } from "next/navigation";
import { myPageService } from "@/features/mypage/service/myPageService";
import {
  User,
  Mail,
  Settings,
  LogOut,
  Edit,
  Save,
  X,
  Upload,
  Camera,
  FileText,
} from "lucide-react";

export default function Home() {
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
      await myPageService.updateBio(bioText.trim());
      updateUserInfo({ bio: bioText.trim() });
      setIsEditingBio(false);
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

  const handleNicknameEdit = () => {
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

  const handleImageEdit = () => {
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 업로드 가능합니다.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("파일 크기는 5MB 이하여야 합니다.");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setError("업로드할 파일을 선택해주세요.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadedImageUrl = await myPageService.uploadProfileImage(
        selectedFile
      );
      updateUserInfo({ imageUrl: uploadedImageUrl });
      setIsEditingImage(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      setError("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 상단 문구 영역 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-amber-900">마이페이지</h1>
          <p className="text-amber-700 mt-2">
            나만의 링크 관리 공간에 오신 것을 환영합니다!
          </p>
        </div>

        {/* 메인 콘텐츠 - 프로필과 이미지 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* 왼쪽: 프로필 정보 */}
          <div className="flex order-2 lg:order-1">
            {/* 사용자 정보 카드 - 이미지와 같은 높이 */}
            <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-8 w-full flex flex-col justify-center">
              {/* 에러 메시지 */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* 프로필 헤더 */}
              <div className="flex items-center space-x-6 mb-8">
                {/* 프로필 이미지 */}
                <div className="relative">
                  {isEditingImage ? (
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                      <User size={40} className="text-amber-600" />
                    </div>
                  ) : userInfo?.imageUrl ? (
                    <img
                      src={userInfo.imageUrl}
                      alt="프로필 이미지"
                      className="w-20 h-20 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                      <User size={40} className="text-amber-600" />
                    </div>
                  )}
                  {!isEditingImage && (
                    <button
                      onClick={handleImageEdit}
                      className="absolute -bottom-1 -right-1 p-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors shadow-lg"
                    >
                      <Camera size={16} />
                    </button>
                  )}
                </div>

                {/* 닉네임과 이메일 */}
                <div className="flex-1">
                  {isEditingNickname ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={nicknameText}
                        onChange={(e) => setNicknameText(e.target.value)}
                        className="text-3xl font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
                        disabled={isSaving}
                        maxLength={20}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleNicknameSave}
                          disabled={isSaving || !nicknameText.trim()}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          <Save size={14} />
                          <span>{isSaving ? "저장 중..." : "저장"}</span>
                        </button>
                        <button
                          onClick={handleNicknameCancel}
                          disabled={isSaving}
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                        >
                          <X size={14} />
                          <span>취소</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-3xl font-bold text-amber-900">
                          {userInfo?.nickname || "사용자"}님
                        </h2>
                        <button
                          onClick={handleNicknameEdit}
                          className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                      <p className="text-lg text-amber-700 mt-1">
                        {userInfo?.email || "이메일 정보 없음"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 이미지 업로드 폼 */}
              {isEditingImage && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
                    <Camera size={20} className="mr-2" />
                    프로필 이미지 변경
                  </h4>

                  <div className="space-y-3">
                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:border-amber-400 hover:bg-amber-100">
                      <div className="text-center">
                        <Upload
                          size={24}
                          className="mx-auto text-amber-600 mb-1"
                        />
                        <p className="text-sm text-amber-700">이미지 선택</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>

                    {selectedFile && (
                      <div className="flex items-center space-x-3 p-2 bg-white rounded border">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="미리보기"
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="text-sm text-amber-900">
                          {selectedFile.name}
                        </span>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {selectedFile && (
                        <button
                          onClick={handleImageUpload}
                          disabled={isUploading}
                          className="flex items-center space-x-1 px-3 py-1 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 disabled:opacity-50"
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              <span>업로드 중...</span>
                            </>
                          ) : (
                            <>
                              <Upload size={14} />
                              <span>업로드</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={handleImageCancel}
                        disabled={isUploading}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                      >
                        <X size={14} />
                        <span>취소</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bio 섹션 */}
              <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <FileText size={20} className="text-amber-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-amber-700">소개</p>
                      {!isEditingBio && (
                        <button
                          onClick={handleBioEdit}
                          className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </div>

                    {isEditingBio ? (
                      <div className="space-y-2">
                        <textarea
                          value={bioText}
                          onChange={(e) => setBioText(e.target.value)}
                          placeholder="자신을 소개해보세요..."
                          className="w-full p-3 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                          rows={2}
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
                              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              <Save size={14} />
                              <span>{isSaving ? "저장 중..." : "저장"}</span>
                            </button>
                            <button
                              onClick={handleBioCancel}
                              disabled={isSaving}
                              className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                            >
                              <X size={14} />
                              <span>취소</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-amber-900">
                        {userInfo?.bio || "아직 소개가 없습니다."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 이미지 */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-lg">
              <Image
                src="/main.png"
                alt="마이페이지 일러스트"
                width={500}
                height={400}
                className="w-full h-auto rounded-lg shadow-lg"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
