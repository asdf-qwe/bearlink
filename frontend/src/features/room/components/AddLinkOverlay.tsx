import React, { useState } from "react";
import { X, Link } from "lucide-react";
import { addLink } from "../service/roomChatService";

interface AddLinkOverlayProps {
  roomId: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const AddLinkOverlay: React.FC<AddLinkOverlayProps> = ({
  roomId,
  isOpen,
  onToggle,
}) => {
  const [form, setForm] = useState({ url: "", title: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!form.url.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      await addLink(roomId, {
        url: form.url.trim(),
        title: form.title.trim() || form.url.trim(),
        thumbnailImageUrl: "",
      });
      setForm({ url: "", title: "" });
      onToggle();
    } catch (error) {
      setError("링크 추가에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({ url: "", title: "" });
    setError("");
    onToggle();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !submitting && form.url.trim()) {
      handleAdd();
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-90 z-50">
      {/* 헤더 */}
      <div className="bg-amber-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-2">
          <Link size={20} />
          <span className="font-semibold">링크 추가</span>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-amber-700 rounded transition-colors"
          aria-label="링크 추가 닫기"
        >
          <X size={16} />
        </button>
      </div>

      {/* 본문 */}
      <div className="bg-white w-80 flex flex-col shadow-lg rounded-b-lg">
        <div className="p-4">
          {/* 에러 메시지 */}
          {error && (
            <div className="text-red-500 mb-4 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {/* 폼 */}
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
                onKeyPress={handleKeyPress}
                placeholder="https://example.com"
                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                disabled={submitting}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">
                제목
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                onKeyPress={handleKeyPress}
                placeholder="제목 (선택사항)"
                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                disabled={submitting}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex space-x-2">
            <button
              onClick={handleAdd}
              disabled={!form.url.trim() || submitting}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {submitting && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>{submitting ? "추가 중..." : "추가"}</span>
            </button>
            <button
              onClick={handleClose}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              disabled={submitting}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
