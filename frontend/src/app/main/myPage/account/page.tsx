"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Shield,
  CreditCard,
  Settings,
} from "lucide-react";

export default function AccountPage() {
  const { userInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    name: "김철수",
    email: "kimcs@example.com",
    phone: "010-1234-5678",
    address: "서울시 강남구 테헤란로 123",
    birthDate: "1990-05-15",
    bio: "안녕하세요! 링크 수집을 좋아하는 개발자입니다.",
  });

  const handleSave = () => {
    // 여기서 실제 API 호출을 통해 정보를 저장할 수 있습니다
    console.log("계정 정보 저장:", editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // 원래 정보로 되돌리기
    setEditedInfo({
      name: "김철수",
      email: "kimcs@example.com",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 123",
      birthDate: "1990-05-15",
      bio: "안녕하세요! 링크 수집을 좋아하는 개발자입니다.",
    });
  };

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">계정 설정</h1>
          <p className="text-amber-700">
            계정 정보를 관리하고 수정할 수 있습니다.
          </p>
        </div>

        {/* 계정 정보 카드 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <User className="mr-2 text-amber-600" size={24} />
              개인 정보
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Edit2 size={16} className="mr-2" />
                수정
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  저장
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X size={16} className="mr-2" />
                  취소
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedInfo.name}
                  onChange={(e) =>
                    setEditedInfo({ ...editedInfo, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User size={16} className="text-gray-400 mr-2" />
                  <span>{editedInfo.name}</span>
                </div>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedInfo.email}
                  onChange={(e) =>
                    setEditedInfo({ ...editedInfo, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail size={16} className="text-gray-400 mr-2" />
                  <span>{editedInfo.email}</span>
                </div>
              )}
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedInfo.phone}
                  onChange={(e) =>
                    setEditedInfo({ ...editedInfo, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Phone size={16} className="text-gray-400 mr-2" />
                  <span>{editedInfo.phone}</span>
                </div>
              )}
            </div>

            {/* 생년월일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                생년월일
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedInfo.birthDate}
                  onChange={(e) =>
                    setEditedInfo({ ...editedInfo, birthDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <span>{editedInfo.birthDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* 주소 */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주소
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedInfo.address}
                onChange={(e) =>
                  setEditedInfo({ ...editedInfo, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MapPin size={16} className="text-gray-400 mr-2" />
                <span>{editedInfo.address}</span>
              </div>
            )}
          </div>

          {/* 자기소개 */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              자기소개
            </label>
            {isEditing ? (
              <textarea
                value={editedInfo.bio}
                onChange={(e) =>
                  setEditedInfo({ ...editedInfo, bio: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <span>{editedInfo.bio}</span>
              </div>
            )}
          </div>
        </div>

        {/* 보안 설정 카드 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
            <Shield className="mr-2 text-amber-600" size={24} />
            보안 설정
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">비밀번호 변경</h3>
                <p className="text-sm text-gray-600">
                  계정 보안을 위해 정기적으로 비밀번호를 변경하세요
                </p>
              </div>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                변경
              </button>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">2단계 인증</h3>
                <p className="text-sm text-gray-600">
                  추가 보안을 위해 2단계 인증을 설정하세요
                </p>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                설정
              </button>
            </div>
          </div>
        </div>

        {/* 계정 통계 카드 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
            <CreditCard className="mr-2 text-amber-600" size={24} />
            계정 통계
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-3xl font-bold text-amber-600 mb-2">15</div>
              <div className="text-gray-600">저장한 링크</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-gray-600">카테고리</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">30일</div>
              <div className="text-gray-600">가입 기간</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
